
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface AdminResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  onSuccess: () => void;
}

const AdminResponseModal = ({ isOpen, onClose, submission, onSuccess }: AdminResponseModalProps) => {
  const { user } = useAuth();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submission?.admin_response) {
      setResponse(submission.admin_response);
    } else {
      setResponse('');
    }
  }, [submission]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          admin_response: response,
          responded_by: user?.id,
          responded_at: new Date().toISOString(),
          status: 'resolved'
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Response saved successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Failed to save response');
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Submission Response</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Submission Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-sm text-gray-900">{submission.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{submission.email}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Subject</p>
              <p className="text-sm text-gray-900">{submission.subject || 'No subject'}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Message</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{submission.message}</p>
            </div>

            <div className="text-xs text-gray-500">
              Submitted on {format(new Date(submission.created_at), 'MMM dd, yyyy at h:mm a')}
            </div>
          </div>

          {/* Response Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Response
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response to the user..."
              rows={6}
              className="w-full"
            />
          </div>

          {submission.admin_response && (
            <div className="text-xs text-gray-500">
              Previously responded on {format(new Date(submission.responded_at), 'MMM dd, yyyy at h:mm a')}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submission.admin_response ? 'Update Response' : 'Send Response'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminResponseModal;
