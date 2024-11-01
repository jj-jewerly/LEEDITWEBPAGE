// src/pages/AdminDashboard/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { checkAdminRole } from '../../firebase/adminAuth';
import './AdminDashboard.css';

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user || !(await checkAdminRole(user.uid))) {
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물 데이터 가져오기
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);

        // 사용자 데이터 가져오기
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // 통계 데이터 계산
        setStats({
          totalPosts: postsData.length,
          totalUsers: usersData.length,
          recentPosts: postsData.filter(post => {
            const postDate = post.date?.toDate();
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return postDate > weekAgo;
          }).length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleUpdateUser = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>관리자 대시보드</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>전체 게시물</h3>
            <p>{stats.totalPosts}</p>
          </div>
          <div className="stat-card">
            <h3>전체 사용자</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>최근 게시물</h3>
            <p>{stats.recentPosts}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="posts-section">
          <h2>게시물 관리</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.nickname}</td>
                    <td>{post.date?.toDate().toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-button"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="users-section">
          <h2>사용자 관리</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>이메일</th>
                  <th>역할</th>
                  <th>가입일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.createdAt?.toDate().toLocaleDateString()}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUser(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;