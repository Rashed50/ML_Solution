"use client"
import { useState } from "react";
import { getCookie } from "@/utils/api"; // Adjust the import path as necessary

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
      upload_form_data(e) 
  };

  
  const upload_form_data = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    //  try {
      //  debugger;
        const csrfToken = getCookie('csrftoken'); // e.g., from js-cookie

          const file = e.target.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);
          
          const response = await fetch(`${apiUrl}image-processing/`, {
            method: 'POST',
            // headers: {
            //   "X-CSRFToken": csrfToken,
            // },
            body: formData
          });
    

          if (!response.ok) {
            throw new Error('File upload failed');
          }

          const data = await response.json();
          console.log('File uploaded successfully:', data);

                
        if (data.image) {
          // Convert Base64 string to data URL
          const imageUrl = `data:image/png;base64,${data.image}`;
          // Display in img tag
          document.getElementById("image_preview2").src = imageUrl;
        }
        
      // } catch (error) {
      //   debugger;
      //   console.error('Error generating card:', error);
      // }
    
  }





  return (
    <div className="flex justify-center items-start min-h-[60vh] p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
        {/* Left: Upload Section */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4m0 0l-4 4m4-4l4 4m5 4v6m0 0l-4-4m4 4l4-4"
              />
            </svg>
            <p className="text-gray-600 text-center">
              Drag & drop your image here or click to select
            </p>
            <input
              id="upload_files"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => document.getElementById("upload_files").click()}
          >
            Choose Image
          </button>

          {selectedFile && (
            <p className="mt-2 text-gray-600 text-center">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Right: Image Preview */}
        <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
          {previewUrl ? (
            <img src={previewUrl} id="image_preview"  alt="Preview" className="max-h-80 w-auto object-contain rounded-lg shadow-md" />
          ) : (
            <p className="text-gray-400 text-center">
              Image preview will appear here
            </p>
          )}
           
        </div>


        <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
          {previewUrl ? (
           <img id="image_preview2" alt="" className="max-h-80 w-auto object-contain rounded-lg shadow-md" />
          ) : (
            <p className="text-gray-400 text-center">
              After Processing Image will appear here
            </p>
          )}
          
       </div>

      </div>      
    </div>
  );
}
