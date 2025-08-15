
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in."
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.displayName);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to SheTalks! Let's personalize your experience."
          });
          navigate('/onboarding');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-pink-200 relative z-20 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold pink-gradient-text mb-2">
          SheTalks
        </CardTitle>
        <p className="text-gray-600">
          {isLogin ? 'Welcome back!' : 'Join the conversation'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your display name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="pl-10 border-gray-300 focus:border-pink-500"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pl-10 border-gray-300 focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pl-10 pr-10 border-gray-300 focus:border-pink-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
