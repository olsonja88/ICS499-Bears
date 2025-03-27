"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setFormData({ name: "", email: "", message: "" });
    setErrors({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { name: "", email: "", message: "" };
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email.";
    if (!formData.message) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    console.log("Form Submitted:", formData);
    alert("Feedback submitted successfully!");
    toggleModal();
  };

  return (
    <div>
      {/* Button to Open Popup */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Feedback
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[5000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Submit Feedback</h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-200 text-black focus:ring focus:ring-blue-300"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-200 text-black focus:ring focus:ring-blue-300"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              {/* Message Field */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-200 text-black focus:ring focus:ring-blue-300"
                  rows={4}
                ></textarea>
                {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
