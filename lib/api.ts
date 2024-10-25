// export const submitBlogPost = async (blogData: any) => {
//     try {
//         const response = await fetch('/api/blogs', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(blogData),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             console.log('Blog created successfully:', result);
//             return { success: true, result };
//         } else {
//             console.error('Failed to create blog:', result);
//             return { success: false, error: result };
//         }
//     } catch (error) {
//         console.error('Error submitting blog:', error);
//         return { success: false, error };
//     }
// };
