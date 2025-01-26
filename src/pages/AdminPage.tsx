// src/pages/AdminPage.tsx
import React from 'react';
import { ProtectedAdminRoute } from '../components/ProtectedAdminRoute';


export function AdminPage() {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      </div>
    </ProtectedAdminRoute>
  );
}