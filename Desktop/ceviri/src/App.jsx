import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts (Düzenler)
import PublicLayout from "./layouts/PublicLayout";
import TranslatorLayout from "./layouts/TranslatorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Global CSS
import "./css/main.css";

// Sayfalar (Pages)
import Home from "./pages/public/Home";
import LoginPage from "./pages/public/LoginPage";
import Register from "./pages/public/Register";
import VerifyPhone from "./pages/public/VerifyPhone";
import ForgotPassword from "./pages/public/ForgotPassword";
// Translator Pages
import TranslatorDashboard from "./pages/translator/TranslatorDashboard";
import LanguageManagement from "./pages/translator/LanguageManagement";
import TranslatorMessages from "./pages/translator/TranslatorMessages";
import ProfileUpdate from "./pages/translator/ProfileUpdate";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminMessages from "./pages/admin/AdminMessages";

// Güvenlik (Route Guard)
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Herkese Açık) */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-phone" element={<VerifyPhone />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 2. TRANSLATOR ROUTES (Sadece Çevirmenler) */}
      {/* Korumalı Rota: Sadece 'Translator' rolü girebilir */}
      <Route element={<ProtectedRoute allowedRoles={["Translator"]} />}>
        <Route path="/translator" element={<TranslatorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TranslatorDashboard />} />
          <Route path="messages" element={<TranslatorMessages />} />
          <Route path="profile" element={<ProfileUpdate />} />
          <Route path="languages" element={<LanguageManagement />} />
        </Route>
      </Route>

      {/* 3. ADMIN ROUTES (Sadece Yöneticiler) */}
      {/* Korumalı Rota: Sadece 'Admin' rolü girebilir */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>

      {/* 4. CATCH ALL (Bilinmeyen Rota) */}
      {/* Kullanıcı var olmayan bir adrese giderse ana sayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
