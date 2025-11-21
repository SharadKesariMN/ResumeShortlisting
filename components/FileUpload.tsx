import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (droppedFiles.length > 0) {
      onFilesChange([...files, ...droppedFiles]);
    }
  }, [files, onFilesChange, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full space-y-4">
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className={`p-4 rounded-full mb-3 ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mb-1 text-sm font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            PDF or DOCX (Max 10 files)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          multiple 
          accept=".pdf,.docx"
          onChange={handleFileInput}
          disabled={disabled}
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Selected Files ({files.length})</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="min-w-[2.5rem] h-10 rounded bg-red-50 flex items-center justify-center text-red-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  disabled={disabled}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;