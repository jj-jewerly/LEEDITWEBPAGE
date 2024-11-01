// src/pages/BulletinBoard.js
import React, { useState, useEffect } from 'react';
import { 
  db, 
  storage, 
  auth,
  serverTimestamp,
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  ref,
  uploadBytes,
  getDownloadURL,
  checkIsAdmin,
  userManagement,
  postManagement,
  getDoc  // 이 부분 추가
} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import bcrypt from 'bcryptjs';

function BulletinBoard() {
    // 상태 관리
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        nickname: '',
        password: '',
        title: '',
        content: '',
        isSecret: false,
        image: null
    });
    const [userIP, setUserIP] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [viewPassword, setViewPassword] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [showUserManagement, setShowUserManagement] = useState(false);

    // 사용자 인증 및 어드민 상태 체크
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const adminStatus = await checkIsAdmin(user);
                setIsAdmin(adminStatus);
            } else {
                setIsAdmin(false);
                setIsAdminMode(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // IP 주소 가져오기
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setUserIP(data.ip))
            .catch(() => setUserIP('Unknown'));
    }, []);

    // 게시글 실시간 업데이트
    useEffect(() => {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    // 어드민 모드일 때 사용자 목록 가져오기
    useEffect(() => {
        if (isAdminMode && showUserManagement) {
            const fetchUsers = async () => {
                const usersList = await userManagement.getAllUsers();
                setUsers(usersList);
            };
            fetchUsers();
        }
    }, [isAdminMode, showUserManagement]);

    // 입력 핸들러
    const handleInputChange = (e) => {
        const { name, type, checked, files, value } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 이미지 업로드
    const uploadImage = async (image) => {
        if (!image) return null;
        const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
    };

    // 게시글 작성
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            const imageUrl = await uploadImage(formData.image);

            await addDoc(collection(db, 'posts'), {
                ...formData,
                password: hashedPassword,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                ip: userIP,
                imageUrl,
                authorEmail: currentUser?.email,
                image: null
            });

            setFormData({
                nickname: '',
                password: '',
                title: '',
                content: '',
                isSecret: false,
                image: null
            });

            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    // 게시글 삭제
    const handleDelete = async (postId) => {
        if (isAdmin || isAdminMode) {
            if (window.confirm('Are you sure you want to delete this post?')) {
                await postManagement.deletePost(postId);
                alert('Post deleted successfully!');
            }
            return;
        }

        const password = prompt('Please enter the post password:');
        const post = posts.find(p => p.id === postId);
        
        if (post && await bcrypt.compare(password, post.password)) {
            await postManagement.deletePost(postId);
            alert('Post deleted successfully!');
        } else {
            alert('Incorrect password!');
        }
    };
    // 비밀글 확인 함수 - 다른 함수들과 같은 위치에 추가
    const handleViewSecret = async (post) => {
      if (isAdmin || isAdminMode) {
          setSelectedPost(post);
          return;
      }

      try {
          const docRef = doc(db, 'posts', post.id);
          const postDoc = await getDoc(docRef);
          
          if (postDoc.exists()) {
              const postData = postDoc.data();
              if (await bcrypt.compare(viewPassword, postData.password)) {
                  setSelectedPost(post);
                  setViewPassword('');
              } else {
                  alert('Incorrect password!');
              }
          }
      } catch (error) {
          console.error('Error checking post password:', error);
          alert('Failed to verify password. Please try again.');
      }
    };
    // 게시글 수정 (어드민 전용)
    const handleEdit = async (post) => {
        setEditingPost(post);
        setFormData({
            nickname: post.nickname,
            password: '',
            title: post.title,
            content: post.content,
            isSecret: post.isSecret,
            image: null
        });
    };

    // 게시글 업데이트 (어드민 전용)
    const handleUpdate = async () => {
        if (!editingPost) return;

        try {
            const imageUrl = formData.image ? 
                await uploadImage(formData.image) : 
                editingPost.imageUrl;

            await postManagement.updatePost(editingPost.id, {
                ...formData,
                imageUrl,
                updatedAt: serverTimestamp()
            });

            setEditingPost(null);
            setFormData({
                nickname: '',
                password: '',
                title: '',
                content: '',
                isSecret: false,
                image: null
            });

            alert('Post updated successfully!');
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        }
    };

    // 사용자 관리 (어드민 전용)
    const handleUserStatusUpdate = async (userId, status) => {
        try {
            await userManagement.updateUserStatus(userId, status);
            const updatedUsers = await userManagement.getAllUsers();
            setUsers(updatedUsers);
            alert('User status updated successfully!');
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status.');
        }
    };

    // 사용자 권한 변경 (어드민 전용)
    const handleUserRoleUpdate = async (userId, isAdmin) => {
        try {
            await userManagement.updateUserRole(userId, isAdmin);
            const updatedUsers = await userManagement.getAllUsers();
            setUsers(updatedUsers);
            alert('User role updated successfully!');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role.');
        }
    };

    return (
      <div className="bulletin-board-page">
          <div className="container py-5">
              {/* 헤더 섹션 */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="card-title text-success">EverPoint Bulletin Board</h2>
                  {currentUser && isAdmin && (
                      <div className="admin-controls">
                          <button 
                              onClick={() => setIsAdminMode(!isAdminMode)} 
                              className={`btn ${isAdminMode ? 'btn-danger' : 'btn-secondary'} me-2`}
                          >
                              {isAdminMode ? 'Exit Admin Mode' : 'Enter Admin Mode'}
                          </button>
                          {isAdminMode && (
                              <button
                                  onClick={() => setShowUserManagement(!showUserManagement)}
                                  className="btn btn-info"
                              >
                                  {showUserManagement ? 'Hide User Management' : 'Show User Management'}
                              </button>
                          )}
                      </div>
                  )}
              </div>

              {/* 관리자 모드 - 사용자 관리 */}
              {isAdminMode && showUserManagement && (
                  <div className="card mb-4">
                      <div className="card-body">
                          <h4 className="card-title">User Management</h4>
                          <div className="table-responsive">
                              <table className="table">
                                  <thead>
                                      <tr>
                                          <th>Email</th>
                                          <th>Name</th>
                                          <th>Status</th>
                                          <th>Role</th>
                                          <th>Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {users.map(user => (
                                          <tr key={user.id}>
                                              <td>{user.email}</td>
                                              <td>{user.displayName}</td>
                                              <td>{user.status}</td>
                                              <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                                              <td>
                                                  <select
                                                      className="form-select form-select-sm me-2"
                                                      value={user.status}
                                                      onChange={(e) => handleUserStatusUpdate(user.id, e.target.value)}
                                                  >
                                                      <option value="active">Active</option>
                                                      <option value="suspended">Suspended</option>
                                                      <option value="banned">Banned</option>
                                                  </select>
                                                  <button
                                                      className={`btn btn-sm ${user.isAdmin ? 'btn-danger' : 'btn-success'}`}
                                                      onClick={() => handleUserRoleUpdate(user.id, !user.isAdmin)}
                                                  >
                                                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              )}

              {/* 게시글 작성/수정 폼 */}
              <div className="card mb-4">
                  <div className="card-body">
                      <h4 className="card-title">{editingPost ? 'Edit Post' : 'Create New Post'}</h4>
                      <form onSubmit={editingPost ? handleUpdate : handleSubmit}>
                          <div className="mb-3">
                              <label className="form-label">Nickname</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  name="nickname"
                                  value={formData.nickname}
                                  onChange={handleInputChange}
                                  required
                              />
                          </div>
                          {!editingPost && (
                              <div className="mb-3">
                                  <label className="form-label">Password</label>
                                  <input
                                      type="password"
                                      className="form-control"
                                      name="password"
                                      value={formData.password}
                                      onChange={handleInputChange}
                                      required
                                  />
                              </div>
                          )}
                          <div className="mb-3">
                              <label className="form-label">Title</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Content</label>
                              <textarea
                                  className="form-control"
                                  name="content"
                                  value={formData.content}
                                  onChange={handleInputChange}
                                  rows="4"
                                  required
                              />
                          </div>
                          <div className="mb-3">
                              <div className="form-check">
                                  <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="isSecret"
                                      checked={formData.isSecret}
                                      onChange={handleInputChange}
                                      id="secretCheck"
                                  />
                                  <label className="form-check-label" htmlFor="secretCheck">
                                      Private Post
                                  </label>
                              </div>
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Image</label>
                              <input
                                  type="file"
                                  className="form-control"
                                  name="image"
                                  onChange={handleInputChange}
                                  accept="image/*"
                              />
                          </div>
                          <div className="d-flex gap-2">
                              <button type="submit" className="btn btn-primary">
                                  {editingPost ? 'Update Post' : 'Create Post'}
                              </button>
                              {editingPost && (
                                  <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={() => {
                                          setEditingPost(null);
                                          setFormData({
                                              nickname: '',
                                              password: '',
                                              title: '',
                                              content: '',
                                              isSecret: false,
                                              image: null
                                          });
                                      }}
                                  >
                                      Cancel Edit
                                  </button>
                              )}
                          </div>
                      </form>
                  </div>
              </div>

              {/* 게시글 목록 */}
              <div className="posts-list">
                  {posts.map((post) => (
                      <div key={post.id} className="card mb-3">
                          <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h5 className="card-title">
                                      {post.isSecret ? '🔒 ' : ''}{post.title}
                                  </h5>
                                  <div className="d-flex gap-2">
                                      {(isAdmin || isAdminMode || (currentUser && currentUser.email === post.authorEmail)) && (
                                          <>
                                              <button
                                                  className="btn btn-sm btn-primary"
                                                  onClick={() => handleEdit(post)}
                                              >
                                                  Edit
                                              </button>
                                              <button
                                                  className="btn btn-sm btn-danger"
                                                  onClick={() => handleDelete(post.id)}
                                              >
                                                  Delete
                                              </button>
                                          </>
                                      )}
                                  </div>
                              </div>
                              <h6 className="card-subtitle mb-2 text-muted">
                                  Posted by {post.nickname} | {post.createdAt?.toDate().toLocaleString()}
                                  {post.updatedAt && post.updatedAt !== post.createdAt && 
                                      ` | Updated: ${post.updatedAt.toDate().toLocaleString()}`
                                  }
                              </h6>
                              {(!post.isSecret || isAdmin || isAdminMode || post === selectedPost) ? (
                                  <>
                                      <p className="card-text">{post.content}</p>
                                      {post.imageUrl && (
                                          <img
                                              src={post.imageUrl}
                                              alt="Post attachment"
                                              className="img-fluid mt-2"
                                              style={{ maxHeight: '300px' }}
                                          />
                                      )}
                                  </>
                              ) : (
                                  <div className="secret-content p-3 bg-light rounded">
                                      <p className="mb-2">🔒 This is a private post.</p>
                                      <div className="d-flex gap-2">
                                          <input
                                              type="password"
                                              className="form-control"
                                              placeholder="Enter password"
                                              onChange={(e) => setViewPassword(e.target.value)}
                                          />
                                          <button
                                              className="btn btn-secondary"
                                              onClick={() => handleViewSecret(post)}
                                          >
                                              View
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
}

export default BulletinBoard;