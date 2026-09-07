'use client'
import React, { useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { compressImage, uploadImageToImgbb } from '@/utils/uploadImage';
import { detectPlatform, platformLabel } from '@/lib/social';
import type { IBlog } from '@/types';
import dynamic from 'next/dynamic';
import {
  FaLink,
  FaImage,
  FaTags,
  FaAlignLeft,
  FaUpload,
  FaArrowRotateRight,
  FaSpinner,
} from 'react-icons/fa6';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const todayYmd = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

interface BlogEditorProps {
  editingBlog?: IBlog | null;
  onSaved?: () => void;
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-transparent transition";

const labelCls = "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white-200 mb-1.5";

const BlogEditor = ({ editingBlog = null, onSaved }: BlogEditorProps) => {
  const isEdit = !!editingBlog;
  const id = typeof editingBlog?._id === "string" ? editingBlog._id : null;
  const [content, setContent] = useState(editingBlog?.content ?? '');
  const [title, setTitle] = useState(editingBlog?.title ?? '');
  const [tags, setTags] = useState((editingBlog?.tags ?? []).join(', '));
  const [coverImage, setCoverImage] = useState<string | null>(editingBlog?.coverImage ?? null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  // social repost fields
  const [sourceUrl, setSourceUrl] = useState(editingBlog?.sourceUrl ?? '');
  const [authorProfileUrl, setAuthorProfileUrl] = useState('');
  const [authorName, setAuthorName] = useState(editingBlog?.authorName ?? '');
  const [authorHandle, setAuthorHandle] = useState(editingBlog?.authorHandle ?? '');
  const [authorAvatar, setAuthorAvatar] = useState(editingBlog?.authorAvatar ?? '');
  const [sourceText, setSourceText] = useState(editingBlog?.sourceText ?? '');
  const [postedAt, setPostedAt] = useState(editingBlog?.postedAt ? String(editingBlog.postedAt).slice(0, 10) : '');
  const [fetchingPreview, setFetchingPreview] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    ['code-block'],
    ['image', 'video'],
    ['clean'],
  ];

  const uploadFile = async (file: File): Promise<string | null> => {
    const compressed = await compressImage(file);
    return uploadImageToImgbb(compressed);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file);
      if (url) setCoverImage(url);
      else setMessage({ type: 'error', text: 'Image upload failed' });
    } catch {
      setMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setAuthorAvatar(url);
      else setMessage({ type: 'error', text: 'Avatar upload failed' });
    } catch {
      setMessage({ type: 'error', text: 'Avatar upload failed' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const fetchPreviewJson = async (u: string) => {
    const res = await fetch(`/api/embeds/preview?url=${encodeURIComponent(u)}`);
    if (!res.ok) throw new Error('preview failed');
    return res.json();
  };

  const handleFetchPreview = async () => {
    if (!sourceUrl.trim()) return;
    setFetchingPreview(true);
    try {
      const data = await fetchPreviewJson(sourceUrl);
      const handle = data.authorHandle?.replace(/^@/, '') ?? '';
      if (data.isProfile) {
        if (data.image && !authorAvatar) setAuthorAvatar(data.image);
        if (handle && !authorHandle) setAuthorHandle(handle);
      }
      if (data.title && !title) setTitle(data.title);
      if (data.content && !sourceText) {
        setSourceText((data.content as string).slice(0, 4000));
      } else if (data.description && !sourceText) {
        setSourceText(data.description);
      }
      if (data.image && !coverImage && !data.isProfile) setCoverImage(data.image);
      if (data.authorName && !authorName) setAuthorName(data.authorName);
      if (data.publishedAt && !postedAt) setPostedAt(data.publishedAt);
      const got = data.title || data.content || data.description;
      setMessage({
        type: got ? 'info' : 'error',
        text: got
          ? `Detected ${platformLabel(detectPlatform(sourceUrl))}${data.isProfile ? ' profile' : ' post'} — auto-filled fields.`
          : 'Could not read that link — fill the fields manually.',
      });
    } catch {
      setMessage({ type: 'error', text: 'Could not fetch preview — fill the fields manually.' });
    } finally {
      setFetchingPreview(false);
    }
  };

  const handleFetchProfile = async () => {
    if (!authorProfileUrl.trim()) return;
    setFetchingProfile(true);
    try {
      const data = await fetchPreviewJson(authorProfileUrl);
      const handle = data.authorHandle?.replace(/^@/, '') ?? '';
      if (data.image) setAuthorAvatar(data.image);
      if (data.authorName && !authorName) setAuthorName(data.authorName);
      if (handle && !authorHandle) setAuthorHandle(handle);
      if (!data.image && !data.authorName) {
        setMessage({ type: 'error', text: 'Could not read that profile URL — upload the avatar or enter it manually.' });
      } else {
        setMessage({ type: 'info', text: 'Profile info filled from the link.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not fetch the profile — enter fields manually.' });
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const platform = sourceUrl.trim() ? detectPlatform(sourceUrl) : 'native';
    const blogData = {
      title,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      content:
        content ||
        (sourceText.trim() ? "" : 'Repost'),
      coverImage,
      sourceUrl: sourceUrl.trim() || undefined,
      sourcePlatform: platform,
      authorName: authorName.trim() || undefined,
      authorHandle: authorHandle.trim() || undefined,
      authorAvatar: authorAvatar.trim() || undefined,
      sourceText: sourceText.trim() || undefined,
      postedAt: postedAt || (platform !== 'native' ? todayYmd() : undefined),
    };
    try {
      const url = isEdit && id ? `/api/blogs/${id}` : "/api/blogs";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
      });
      if (!response.ok) throw new Error("Failed to save blog");
      setMessage({ type: 'success', text: isEdit ? 'Blog updated!' : 'Blog published! It now appears in the blog grid.' });
      if (!isEdit) {
        setTitle(''); setTags(''); setContent('');
        setSourceUrl(''); setAuthorProfileUrl(''); setAuthorName(''); setAuthorHandle('');
        setAuthorAvatar(''); setSourceText(''); setPostedAt('');
        setCoverImage(null);
        if (coverFileRef.current) coverFileRef.current.value = '';
        if (avatarFileRef.current) avatarFileRef.current.value = '';
      }
      onSaved?.();
    } catch (error) {
      console.error("Error saving blog:", error);
      setMessage({ type: 'error', text: isEdit ? 'Failed to update. Are you logged in as admin?' : 'Failed to publish. Are you logged in as admin?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {isEdit ? 'Edit' : 'Create a New'}{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Blog Post</span>
          </h1>
          <p className="text-sm text-white-200 mt-1">
            Write original content, or paste a social link to repost it — details are auto-extracted.
          </p>
        </div>
        {isEdit && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple/20 border border-purple/40 text-purple-100">
            Editing: {editingBlog.title}
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={coverFileRef}
        onChange={handleCoverChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={avatarFileRef}
        onChange={handleAvatarChange}
        className="hidden"
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left: form */}
        <div className="space-y-5">
          {/* Social link card */}
          <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-1">
              <FaLink className="text-purple" /> Social post or profile link
            </h2>
            <p className="text-xs text-white-200 mb-4">
              Paste a LinkedIn / Facebook / X link — title, excerpt, cover, author & date are filled automatically.
            </p>

            <label className={labelCls}>Post link</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                onBlur={handleFetchPreview}
                className={inputCls}
                placeholder="https://www.linkedin.com/posts/..."
              />
              <button
                type="button"
                disabled={fetchingPreview || !sourceUrl.trim()}
                onClick={handleFetchPreview}
                className="shrink-0 inline-flex items-center gap-1.5 bg-purple/70 hover:bg-purple text-white text-sm font-semibold px-4 rounded-lg disabled:opacity-50 transition"
              >
                {fetchingPreview ? <FaSpinner className="animate-spin" /> : <FaArrowRotateRight />}
                Preview
              </button>
            </div>
            {sourceUrl.trim() && (
              <p className="text-xs mt-1.5 text-purple-100">
                Detected: {platformLabel(detectPlatform(sourceUrl))}
              </p>
            )}

            <label className={`${labelCls} mt-4`}>Author profile link <span className="normal-case font-normal text-white-200/60">(auto-fills name, handle &amp; avatar)</span></label>
            <div className="flex gap-2">
              <input
                type="url"
                value={authorProfileUrl}
                onChange={(e) => setAuthorProfileUrl(e.target.value)}
                onBlur={handleFetchProfile}
                className={inputCls}
                placeholder="https://www.linkedin.com/in/username"
              />
              <button
                type="button"
                disabled={fetchingProfile || !authorProfileUrl.trim()}
                onClick={handleFetchProfile}
                className="shrink-0 inline-flex items-center gap-1.5 bg-purple/70 hover:bg-purple text-white text-sm font-semibold px-4 rounded-lg disabled:opacity-50 transition"
              >
                {fetchingProfile ? <FaSpinner className="animate-spin" /> : <FaArrowRotateRight />}
                Get
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Author name</label>
                <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Profile name" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>@handle</label>
                <input value={authorHandle} onChange={(e) => setAuthorHandle(e.target.value)} placeholder="@handle" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Avatar</label>
                <div className="flex items-center gap-3">
                  {authorAvatar && (
                    <img src={authorAvatar} alt="avatar" className="size-10 rounded-full object-cover border border-white/20 shrink-0" loading="lazy" />
                  )}
                  <input value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} placeholder="Avatar image URL" className={inputCls} />
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current?.click()}
                    disabled={avatarUploading}
                    className="shrink-0 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50 transition"
                  >
                    {avatarUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                    Upload
                  </button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Post date</label>
                <input value={postedAt} onChange={(e) => setPostedAt(e.target.value)} type="date" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Excerpt / quote</label>
                <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Excerpt or quote from the original post" rows={2} className={`${inputCls} resize-none`} />
              </div>
            </div>
          </section>

          {/* Cover image */}
          <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
              <FaImage className="text-purple" /> Cover image
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => coverFileRef.current?.click()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                {coverImage ? 'Replace image' : 'Upload image'}
              </button>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="text-xs text-white-200 underline hover:text-white"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="url"
              value={coverImage ?? ''}
              onChange={(e) => setCoverImage(e.target.value || null)}
              className={`${inputCls} mt-3`}
              placeholder="...or paste a cover image URL"
            />
          </section>

          {/* Title & tags */}
          <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <label className={labelCls}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Enter your blog title" required />

            <label className={`${labelCls} mt-4`}>Tags</label>
            <div className="flex items-center gap-2">
              <FaTags className="text-white-200 shrink-0" />
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="comma, separated, tags" />
            </div>
          </section>

          {/* Content */}
          <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <FaAlignLeft className="text-purple" /> Content
            </h2>
            <ReactQuill
              className='custom-quill'
              value={content}
              onChange={setContent}
              placeholder='Write your content here.. (for reposts: add your own commentary)'
              modules={{ toolbar: toolbarOptions }}
              theme="snow"
            />
          </section>

          <div className="flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={loading} className="bg-white text-black-100 cursor-pointer font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Publish Blog'}
            </Button>
            {isEdit && (
              <button
                type="button"
                onClick={() => onSaved?.()}
                className="text-sm text-white-200 underline hover:text-white"
              >
                Cancel edit
              </button>
            )}
            {message && (
              <span className={`text-sm ${message.type === 'error' ? 'text-red-400' : message.type === 'success' ? 'text-emerald-400' : 'text-white-100'}`}>
                {message.text}
              </span>
            )}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-6">
          <h3 className="text-sm font-bold text-white-200 uppercase tracking-wider mb-3">Live preview</h3>
          <div className="rounded-2xl bg-[#04071D] border border-white/10 overflow-hidden">
            {coverImage && (
              <div className="w-full h-40 sm:h-48 overflow-hidden">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 flex-wrap">
                {sourceUrl.trim() && (
                  <span className="inline-flex items-center gap-1.5 bg-purple/20 border border-purple/40 text-purple-100 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {platformLabel(detectPlatform(sourceUrl))} repost
                  </span>
                )}
                {postedAt && <span className="text-[11px] text-white-200">{postedAt}</span>}
              </div>

              <h2 className="text-xl font-bold text-white mt-3 leading-snug">{title || 'Your title'}</h2>

              {(authorAvatar || authorName || authorHandle) && (
                <div className="flex items-center gap-2.5 mt-4">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt="author" className="size-9 rounded-full object-cover border border-white/20" loading="lazy" />
                  ) : (
                    <div className="size-9 rounded-full bg-purple/30 border border-purple/40 flex items-center justify-center text-xs font-bold text-white">
                      {(authorName || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">{authorName || 'Author name'}</p>
                    {authorHandle && <p className="text-xs text-white-200">{authorHandle}</p>}
                  </div>
                </div>
              )}

              {tags.trim() && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tags.split(',').map((tag, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 text-white-200 text-xs px-2 py-0.5 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {sourceText && (
                <blockquote className="border-l-4 border-purple pl-3 my-4 text-white-100 italic text-sm leading-relaxed">
                  {sourceText}
                </blockquote>
              )}

              {content && (
                <div
                  className="text-white-100 mt-2 text-sm leading-relaxed [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-base [&_a]:text-purple [&_img]:rounded-lg [&_img]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {!coverImage && !title && !content && !sourceText && (
                <p className="text-sm text-white-200/60 py-6 text-center">
                  Fill the form to see a live preview of your card.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogEditor;