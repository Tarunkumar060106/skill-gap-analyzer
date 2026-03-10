import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Verify() {
  const { user, requestVerification, logoutUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if(dropped && dropped.type.startsWith('image/')) handleFile(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if(selected) handleFile(selected);
  };

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if(!file) return;
    setLoading(true);
    try {
      await requestVerification(file);
      navigate('/restricted');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if(user?.verificationStatus === 'pending') {
    return (
      <Card className="max-w-xl mx-auto mt-8 p-12 text-center bg-secondary/20 border-border/50">
        <Clock className="w-16 h-16 mx-auto text-orange-400 mb-6" />
        <CardTitle className="text-2xl mb-4">Verification Pending</CardTitle>
        <CardDescription className="text-lg mb-8">
          Your ID is under review. You will gain full access once verified.
        </CardDescription>
        <Button size="lg" onClick={() => navigate('/restricted')}>Go to Dashboard</Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto bg-secondary/20 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Student Identity</CardTitle>
        <CardDescription>
          Upload your college ID before accessing tests. We accept JPG and PNG formats.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!preview ? (
          <div 
            className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={48} className="text-primary mb-4 mx-auto" />
            <p className="font-medium text-lg mb-2">Drag and drop your ID card here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleChange} 
              hidden 
              accept="image/jpeg, image/png"
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/30 p-2">
            <img src={preview} alt="ID Preview" className="w-full h-auto rounded-lg object-contain max-h-[400px]" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-4 right-4 rounded-full shadow-lg"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-4 pt-2">
        <Button 
          onClick={handleSubmit} 
          disabled={!file || loading} 
          size="lg"
          className="flex-1"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </Button>
        <Button variant="outline" size="lg" onClick={logoutUser}>Logout</Button>
      </CardFooter>
    </Card>
  );
}
