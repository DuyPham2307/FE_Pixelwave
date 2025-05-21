import React, { useEffect, useState } from "react";
import {
  createCollection,
  deleteCollection,
  getUserCollections,
  getCollectionById,
  updateCollection,
  getPostsInCollection,
  removePostFromCollection,
} from "@/services/collectionService";
import { CollectionRequestDTO, CollectionResponseDTO } from "@/models/CollectionModel";
import { PostSimple } from "@/models/PostModel";
import "@/styles/pages/_collection.scss";
import toast from "react-hot-toast";
import { SquarePlus } from "lucide-react";

const CollectionsPage = () => {
  const [collections, setCollections] = useState<CollectionResponseDTO[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionResponseDTO | null>(null);
  const [posts, setPosts] = useState<PostSimple[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isPublic, setIsPulic] = useState(true);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await getUserCollections();
    setCollections(data);
  };

  const selectCollection = async (collection: CollectionResponseDTO) => {
    setSelectedCollection(collection);
    const postList = await getPostsInCollection(collection.id);
    setPosts(postList);
  };

  const handleCreate = async () => {
    const data: CollectionRequestDTO = { title: newCollectionName, isPublic, description: newDescription };
    const newCollection = await createCollection(data);
    setCollections([...collections, newCollection]);
    setShowModal(false);
    setNewCollectionName("");
    setIsPulic(true);
    toast.success("Create collection successfully!");
  };

  const handleDelete = async (collectionId: number) => {
    await deleteCollection(collectionId);
    setCollections(collections.filter((c) => c.id !== collectionId));
    setSelectedCollection(null);
    setPosts([]);
    toast.success("Delete collection successfully!");
  };

  return (
    <div className="collections-page">
      <aside className="sidebar">
        <button onClick={() => setShowModal(true)} className="create-button">
          <SquarePlus /> Create collections
        </button>
        <div className="collection-list">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="collection-item"
              onClick={() => selectCollection(collection)}
            >
              <p>{collection.title}</p>
              <p className="privacy">{collection.isPublic ? "Public" : "Private"}</p>
              <p className="privacy">{collection.description}</p>
            </div>
          ))}
        </div>
      </aside>
      <main className="main-content">
        {selectedCollection ? (
          <div>
            <div className="collection-header">
              <div>
                <h2>Collection name: {selectedCollection.title}</h2>
                <h5>{selectedCollection.title}</h5>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(selectedCollection.id)}
              >
                Delete
              </button>
            </div>
            <p>Quantity of posts: {posts.length}</p>
            <div className="post-grid">
              {posts.map((post) => (
                <img
                  key={post.id}
                  src={post.imageUrl}
                  alt="post"
                  className="post-thumbnail"
                />
              ))}
              <div className="add-more">Add more</div>
            </div>
          </div>
        ) : (
          <h2>Select a collection to view its posts.</h2>
        )}
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection title"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPulic(e.target.checked)}
              />
              Public
            </label>
            <label>
              <input
                type="text"
                placeholder="Collection description"
                onChange={(e) => setNewDescription(e.target.value)}
              />
              Public
            </label>
            <div className="modal-actions">
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;