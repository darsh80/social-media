import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePosts from "../../customHooks/usePosts";
import PostCard from "../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import AddPost from "../../Components/AddPost/AddPost";
import CommentsWrapper from "../../Components/CommentsWrapper/CommentsWrapper";
import LikesWrapper from "../../Components/LikesWrapper/LikesWrapper";
import { useState } from "react";

export default function Posts() {
  const { data, isLoading, isError, isFetching, isFetched } = usePosts(
    ["allPosts"],
    true,
    "posts?limit=50&sort=-createdAt",
  );

  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [postToBeUpdate, setPostToBeUpdate] = useState(null);

  const [likesOpen, setLikesOpen] = useState(false);
  const [activeLikesPostId, setActiveLikesPostId] = useState(null);

  return (
   <>
  <title>Posts</title>

  <div className="bg-gray-50 min-h-screen py-8 flex justify-center">
    <div className="w-full max-w-4xl px-4 space-y-6">

      {/* AddPost Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <AddPost postToBeUpdate={postToBeUpdate} />
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <PostCardLoadingSkeleton />
          <PostCardLoadingSkeleton />
          <PostCardLoadingSkeleton />
        </div>
      )}

      {/* Error Handling */}
      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-semibold">
          Failed to load posts. Please try again.
        </div>
      )}

      {/* No Posts */}
      {isFetched && data?.posts?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            No posts yet. Be the first to post!
          </p>
        </div>
      )}

      {/* Posts Feed */}
      {isFetched &&
        data?.posts?.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition-shadow duration-300"
          >
            <PostCard
              post={post}
              setIsOpen={setIsOpen}
              setActivePostId={setActivePostId}
              activePostId={activePostId}
              setPostToBeUpdate={setPostToBeUpdate}
              setLikesOpen={setLikesOpen}
              setActiveLikesPostId={setActiveLikesPostId}
            />
          </div>
        ))}
    </div>
  </div>

  {/* Comments Popup */}
  <CommentsWrapper
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    handleClose={handleClose}
    activePostId={activePostId}
  />

  {/* Likes Popup */}
  <LikesWrapper
    isOpen={likesOpen}
    handleClose={() => setLikesOpen(false)}
    postId={activeLikesPostId}
  />
</>
  );
}