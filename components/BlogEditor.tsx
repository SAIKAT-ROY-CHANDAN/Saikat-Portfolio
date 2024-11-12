'use client'
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { Button } from './ui/button';
import { compressImage, uploadImageToImgbb } from '@/utils/uploadImage';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogEditor = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverImageName, setCoverImageName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            setCoverImageName(file.name);

            try {
                const compressedImage = await compressImage(file);
                const uploadedImageUrl = await uploadImageToImgbb(compressedImage);

                if (uploadedImageUrl) {
                    setCoverImage(uploadedImageUrl);
                }
            } catch (error) {
                console.error('Error handling image:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        const blogData = {
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            content,
            coverImage
        };

        try {
            const response = await fetch("https://portfolio-backend-tawny-gamma.vercel.app/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(blogData)
            });
    
            if (!response.ok) {
                throw new Error("Failed to create blog");
            }
    
            const result = await response.json();
            // console.log("Blog created:", result);
        } catch (error) {
            console.error("Error creating blog:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md">
            <h1 className="heading">
                Create a New {' '}
                <span className="text-purple">Blog Post</span>
            </h1>
            <div className='flex gap-x-4 mx-6 mt-8'>
                {/* Cover Image Input */}
                <div className='w-1/2'>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 bg-gray-50 rounded-md p-2 w-full"
                            placeholder="Add cover image"
                        />
                    </div>
                    {coverImageName && (
                        <span className="ml-4 text-sm text-white-100">{coverImageName}</span>
                    )}

                    {/* Title Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 bg-gray-50 text-black-100 rounded-md p-2 w-full"
                            placeholder="Enter your blog title"
                        />
                    </div>

                    {/* Tags Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="border border-gray-300 bg-gray-50 text-black-100 rounded-md p-2 w-full"
                            placeholder="Enter tags separated by commas"
                        />
                    </div>

                    {/* Content Editor */}
                    <ReactQuill
                        className='bg-gray-50 mb-4 text-black custom-quill'
                        value={content}
                        onChange={setContent}
                        placeholder='Write your content here..'
                        modules={{
                            toolbar: toolbarOptions,
                        }}
                        theme="snow"
                        style={{
                            height: '400px',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                        }}
                    />

                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="mt-8 bg-white text-black-100 cursor-pointer font-semibold py-2 px-4 rounded-md"
                    >
                        <span className='cursor-pointer'>Submit</span>
                    </Button>
                </div>

                <div className='w-1/2'>
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="border p-4 rounded-md bg-gray-100 h-[620px]">
                        {coverImage && (
                            <Image
                                width={1080}
                                height={720}
                                src={coverImage}
                                alt="Cover Preview"
                                className="rounded-md mt-2 mb-4 size-24 object-cover"
                            />
                        )}
                        <h2 className="text-xl font-bold text-black-100">{title}</h2>
                        {tags.trim() && (
                            <div className="flex flex-wrap mt-2">
                                {tags.split(',').map((tag, index) => (
                                    <span key={index} className="bg-blue-200 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className='text-black'>
                            <div className='overflow-auto' dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
