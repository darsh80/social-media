import React, { useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePosts from "../../../customHooks/usePosts";
import PostCard from "../../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import AddPost from "../../../Components/AddPost/AddPost";
import CommentsWrapper from "../../../Components/CommentsWrapper/CommentsWrapper";
import { FiSettings } from "react-icons/fi";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, FileInput, Label } from "flowbite-react";
import toast from "react-hot-toast";
import { getHeaders } from "../../../helper/HeadersObj";
import { AiFillLike } from "react-icons/ai";

// Own profile page - always shows the logged-in user's profile
export default function Profaile() {
  const { userData, setUserData } = useContext(AuthContext);
  const isOwnProfile = true;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Always own profile - fetch profile-data endpoint
  const { data: profileQueryResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userData?._id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/profile-data`,
        getHeaders()
      );
      const user = data.data?.user || data.user;
      return { user };
    },
    enabled: !!userData?._id
  });

  const profileData = profileQueryResponse?.user;

  const { data, isLoading, isFetched } = usePosts(
    ["profailPosts", userData?._id],
    Boolean(userData?._id),
    `users/${userData?._id}/posts?limit=50`,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [postToBeUpdate, setPostToBeUpdate] = useState(null);
  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const handleClose = () => setIsOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCoverFile(file);
      toast.success(`Cover photo selected: ${file.name}`);
    }
  };

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", file);

      const { data } = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            token: token || "",
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onMutate: () => {
      toast.loading("Uploading photo...", { id: "upload-photo" });
    },
    onSuccess: (data) => {
      if (data.message === "success") {
        setUserData((prev) => ({
          ...prev,
          photo: data.user.photo,
        }));
        queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
        toast.success("Profile photo updated successfully", {
          id: "upload-photo",
        });
        setIsPhotoModalOpen(false);
        setSelectedFile(null);
        setPhotoCaption("");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload photo", {
        id: "upload-photo",
      });
    },
  });

  const uploadCoverPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("coverPhoto", file);

      const { data } = await axios.put(
        "https://route-posts.routemisr.com/users/upload-cover-photo",
        formData,
        {
          headers: {
            token: token || "",
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onMutate: () => {
      toast.loading("Uploading cover photo...", { id: "upload-cover" });
    },
    onSuccess: (data) => {
      if (data.message === "success") {
        setUserData((prev) => ({
          ...prev,
          coverPhoto: data.user.coverPhoto,
        }));
        toast.success("Cover photo updated successfully", {
          id: "upload-cover",
        });
        setIsCoverModalOpen(false);
        setSelectedCoverFile(null);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to upload cover photo",
        {
          id: "upload-cover",
        },
      );
    },
  });

  const handleUploadPhoto = () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }
    uploadPhotoMutation.mutate(selectedFile);
  };

  const handleUploadCoverPhoto = () => {
    if (!selectedCoverFile) {
      toast.error("Please select a cover photo first");
      return;
    }
    uploadCoverPhotoMutation.mutate(selectedCoverFile);
  };

  return (
<>
  <title>Profile</title>

  <div className="bg-gray-50 min-h-screen">
    {/* Cover Photo */}
    <div className="relative w-full h-72 bg-gray-200">
      {profileData?.coverPhoto || (isOwnProfile && userData?.coverPhoto) ? (
        <img
          src={profileData?.coverPhoto || userData?.coverPhoto}
          alt="Cover Photo"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-80"></div>
      )}

      {/* Profile Picture */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <img
          src={profileData?.photo || userData?.photo || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
        />

        {/* Settings Icon */}
        {isOwnProfile && (
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow hover:shadow-lg transition"
            title="Settings"
          >
            <FiSettings size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>

    {/* Settings Drawer */}
    {isSettingsOpen && (
      <div className="fixed top-0 right-0 w-72 bg-white shadow-2xl h-full z-50 p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
        <button
          onClick={() => setIsPhotoModalOpen(true)}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold"
        >
          Change Profile Photo
        </button>
        <button
          onClick={() => setIsCoverModalOpen(true)}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg font-semibold"
        >
          Change Cover Photo
        </button>
        <button
          onClick={() => navigate("/changePassword")}
          className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg font-semibold"
        >
          Change Password
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setUserData(null);
            navigate("/login");
          }}
          className="mt-auto px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    )}

    {/* Main content below profile picture */}
    <div className="mt-20 max-w-4xl mx-auto px-4 flex flex-col gap-6">
      {/* Name and info */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {profileData?.name || userData?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          @{profileData?.username || userData?.username}
        </p>
        <p className="text-gray-500 mt-2">
          {profileData?.email || userData?.email}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-800">{profileData?.followersCount || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-800">{profileData?.followingCount || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold">Following</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-800">{data?.posts?.length || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold">Posts</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-bold transition shadow-sm border border-slate-200"
          >
            📷 Update Profile Photo
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Profile link copied!");
            }}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold transition border border-slate-200 shadow-sm"
          >
            <FaShare /> Share
          </button>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-800 rounded-full"></span>
          Create Post
        </h2>
        <AddPost postToBeUpdate={postToBeUpdate} />
      </div>

      {/* User Posts */}
      <div className="flex flex-col gap-4">
        {isFetched && data?.posts?.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            setIsOpen={setIsOpen}
            setActivePostId={setActivePostId}
            activePostId={activePostId}
            setPostToBeUpdate={setPostToBeUpdate}
          />
        ))}
        {isFetched && data?.posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>

    {/* Comments Drawer */}
    <CommentsWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      activePostId={activePostId}
    />
  </div>
</>
  );
}