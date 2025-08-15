
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import AdminResponseModal from './AdminResponseModal';

const ContactSubmissionsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const { data: submissions, refetch } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredSubmissions = submissions?.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRespond = (submission: any) => {
    setSelectedSubmission(submission);
    setIsResponseModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contact Submissions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions?.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                    <div className="text-sm text-gray-500">{submission.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{submission.subject || 'No subject'}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {submission.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(submission.status || 'pending')}>
                    {submission.status || 'pending'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRespond(submission)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    {submission.admin_response ? 'View Response' : 'Respond'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubmissions?.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No contact submissions found.
        </div>
      )}

      <AdminResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        submission={selectedSubmission}
        onSuccess={() => {
          refetch();
          setIsResponseModalOpen(false);
        }}
      />
    </div>
  );
};

export default ContactSubmissionsList;
