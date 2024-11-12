'use client'
import BlogEditor from "@/components/BlogEditor"
import Image from "next/image";
import { useRouter } from "next/navigation";


const DashboardPage = () => {
  const router = useRouter();
  const user = { name: "Saikat Roy" };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/");
  };


  return (
    <div>
      <BlogEditor />
      {user && (
        <div className="p-8">
          <div className="w-16 h-16">
            <Image src='/public/dj-programmer.jpg' width={1080} height={720} alt="saikat-roy" />
            {/* <img src='/public/blog-thumbnail.webp'  alt="saikat-roy" /> */}
          </div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <button
            className="bg-white-100 text-black-200 px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

    </div>
  )
}

export default DashboardPage