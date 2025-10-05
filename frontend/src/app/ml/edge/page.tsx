"use client"
import { useState } from "react";
// Assuming getCookie is defined elsewhere, though it's not used in the fixed version below
// as headers are commented out, but kept for context.
import { getCookie } from "@/utils/api"; 

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX: The 'process' object is not defined in this environment, causing ReferenceError.
  // Using a placeholder URL to prevent the crash. In a proper Next.js environment, 
  // you would revert to using process.env.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const upload_file = async (file) => {
    setIsLoading(true);
    setError(null);
    setProcessedImageUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Fetching CSRF token (if needed for Django/Laravel backends)
      // const csrfToken = getCookie('csrftoken'); 

      const response = await fetch(`${apiUrl}image-edge_detector/`, {
        method: 'POST',
        // Uncomment headers if you need CSRF protection
        // headers: {
        //   "X-CSRFToken": csrfToken, 
        // },
        body: formData
      });

      debugger;

      if (!response.ok) {
        // Attempt to read error message from the response body
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`File upload failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);

      if (data.image) {
        // Assuming the backend returns a base64 string
        setProcessedImageUrl(`data:image/png;base64,${data.image}`);
      } else {
        // Handle case where image property is missing but upload succeeded
        console.warn("Upload successful but 'image' property missing in response data.");
      }

    } catch (err) {
      console.error('Error generating card:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // 1. Update state for the file and preview (Synchronous)
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // 2. Start the upload process (Asynchronous)
    upload_file(file);
  };

  return (
    <div className="flex justify-center items-start min-h-[60vh] p-6 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        
        {/* Header/Instructions */}
        <div className="p-4 bg-indigo-600 text-white text-center rounded-t-lg">
          <h1 className="text-2xl font-bold">Image Edge Detection</h1>
          <p className="text-sm">Upload an image to see the immediate preview and the processed result.</p>
        </div>

        {/* Main Content: 3 Columns */}
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* Left: Upload Section */}
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-start">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Image</h2>
            <label
              htmlFor="upload_files"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition p-4"
            >
              <svg
                className="w-12 h-12 text-indigo-400 mb-3"
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
              <p className="text-gray-600 text-center text-sm">
                Click here or drag & drop to select image
              </p>
              <input
                id="upload_files"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <p className="mt-4 text-sm text-gray-700 font-medium">
                Selected File: <span className="text-indigo-600">{selectedFile.name}</span>
              </p>
            )}

            {isLoading && (
                <div className="mt-4 flex items-center text-indigo-600">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing image...
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-600 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    Error: {error}
                </div>
            )}
          </div>

          {/* Middle: Original Image Preview */}
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-start bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Original Preview</h2>
            <div className="h-64 w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Original Preview" 
                  className="max-h-full w-auto object-contain" 
                />
              ) : (
                <p className="text-gray-400 text-center p-4">
                  Image preview will appear here
                </p>
              )}
            </div>
          </div>

          {/* Right: Processed Image Result */}
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-start bg-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Processed Result</h2>
            <div className="h-64 w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              {processedImageUrl ? (
                <img 
                  src={processedImageUrl} 
                  alt="Processed Result" 
                  className="max-h-full w-auto object-contain" 
                />
              ) : isLoading ? (
                <p className="text-indigo-400">Awaiting result...</p>
              ) : (
                <p className="text-gray-400 text-center p-4">
                  Processed image will appear here
                </p>
              )}
            </div>
            
          </div>

        </div>      
      </div>
    </div>
  );
}
