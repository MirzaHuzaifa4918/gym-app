import React, { useState, useRef, useEffect } from 'react';
import { analyzeFoodImage } from '../../services/geminiService';
import type { CalorieAnalysis } from '../../types';
import { Loader } from '../Loader';

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

export const CalorieCounterView: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<CalorieAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const cleanupCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        return () => {
            cleanupCamera();
        };
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            cleanupCamera();
            setIsCameraOn(false);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setAnalysis(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imageSrc) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const base64Image = imageSrc.split(',')[1];
            const result = await analyzeFoodImage(base64Image);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            cleanupCamera();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setIsCameraOn(true);
                    setImageSrc(null);
                    setAnalysis(null);
                    setError(null);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions and try again.");
            }
        }
    };

    const takePicture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImageSrc(dataUrl);
            cleanupCamera();
            setIsCameraOn(false);
        }
    };

    const buttonClasses = "flex items-center justify-center py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500";

    return (
        <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white">AI Nutritionist</h2>
            <p className="text-center text-gray-400 -mt-4">Upload or take a photo of your meal to get a calorie and macro estimate.</p>
            
            <div className="flex justify-center flex-wrap gap-4">
                <button onClick={() => fileInputRef.current?.click()} className={buttonClasses}><UploadIcon /> Upload Photo</button>
                <button onClick={startCamera} className={buttonClasses}><CameraIcon />Use Camera</button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
                {isCameraOn && <video ref={videoRef} className="w-full h-full object-cover" muted playsInline aria-label="Camera feed"></video>}
                {imageSrc && !isCameraOn && <img src={imageSrc} alt="Food for analysis" className="max-h-full max-w-full object-contain" />}
                {!imageSrc && !isCameraOn && <p className="text-gray-500">Image preview will appear here</p>}
            </div>
            
            {isCameraOn && <button onClick={takePicture} className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-bold text-lg transition-colors">Take Picture</button>}

            {imageSrc && !isCameraOn && (
                 <button onClick={handleAnalyze} disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-red-900 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300">
                    {isLoading ? 'Analyzing...' : 'Analyze Calories'}
                </button>
            )}

            {isLoading && <Loader />}

            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}

            {analysis && (
                <div className="bg-gray-900/70 p-4 rounded-lg animate-fade-in border border-gray-600">
                    <h3 className="text-2xl font-bold text-red-500 capitalize">{analysis.dishName}</h3>
                    <p className="text-gray-300 mt-2 text-sm italic">"{analysis.notes}"</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-gray-800 p-3 rounded-lg"><p className="text-sm text-gray-400">Calories</p><p className="text-xl font-bold text-white">{analysis.calories}</p></div>
                        <div className="bg-gray-800 p-3 rounded-lg"><p className="text-sm text-gray-400">Protein</p><p className="text-xl font-bold text-white">{analysis.protein}</p></div>
                        <div className="bg-gray-800 p-3 rounded-lg"><p className="text-sm text-gray-400">Carbs</p><p className="text-xl font-bold text-white">{analysis.carbs}</p></div>
                        <div className="bg-gray-800 p-3 rounded-lg"><p className="text-sm text-gray-400">Fat</p><p className="text-xl font-bold text-white">{analysis.fat}</p></div>
                    </div>
                </div>
            )}
        </div>
    );
};
