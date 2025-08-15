
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContactSubmissionsList from '@/components/ContactSubmissionsList';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('contact_submissions')
        .select('*');
      
      if (error) throw error;
      
      const totalSubmissions = submissions.length;
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
      const resolvedSubmissions = submissions.filter(s => s.status === 'resolved').length;
      
      return {
        totalSubmissions,
        pendingSubmissions,
        resolvedSubmissions
      };
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{stats?.totalSubmissions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats?.pendingSubmissions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{stats?.resolvedSubmissions || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Submissions List */}
        <ContactSubmissionsList />
      </div>
    </div>
  );
};

export default AdminDashboard;
