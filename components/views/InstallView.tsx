import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Loader } from '../Loader';

const AppStoreIcon = () => <svg className="w-8 h-8 mr-3" viewBox="0 0 32 32"><path fill="#FFF" d="M21.996 10.749c.004-.004 0-.004-.004.004C19.52 8.275 16.92 8.03 16.92 8.03c-2.382-.12-4.836 1.48-6.156 3.018-.004 0-.004.004 0 0-3.22 3.3-2.454 8.783 1.05 11.465 1.705 1.308 3.65 1.98 5.106 1.905 1.342-.07 2.68-.625 4.02-1.748-2.38-1.502-3.864-4.05-3.864-6.845 0-2.88 1.63-5.508 4.214-6.994l-.28-.088c-.004 0 .004 0 0 0m-1.28-4.008c1.338-.052 2.625.5 3.593 1.428-1.12.87-2.33 1.393-3.712 1.44-.98.033-2.01-.33-2.934-1.09a3.172 3.172 0 0 1-.22-.204c.82-.47 1.83-.58 2.273-.574z"/></svg>;
const GooglePlayIcon = () => <svg className="w-7 h-7 mr-3" viewBox="0 0 32 32"><path fill="#FFF" d="m4.688 3.22 18.75 12.313L4.688 27.844zM24.875 16 4.688 3.22v24.625zM27.25 18.438l-2.375-2.438-4.25 4.25 6.625-1.813zM27.25 12.625L20.625 14l4.25 4.25 2.375-2.438z"/></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const AddToHomeScreenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const MoreVertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>

const InstructionStep: React.FC<{ number: number; children: React.ReactNode }> = ({ number, children }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold text-lg">
            {number}
        </div>
        <div className="pt-1 text-gray-300">{children}</div>
    </li>
);

interface InstallViewProps {
    deferredPrompt: any;
}

const StoreButton: React.FC<{ icon: React.ReactNode; line1: string; line2: string; onClick: () => void; }> = ({ icon, line1, line2, onClick }) => (
    <button onClick={onClick} className="flex items-center bg-black text-white py-2 px-5 rounded-lg border border-gray-600 hover:bg-gray-900 transition-all duration-300 w-full sm:w-auto">
        {icon}
        <div className="text-left">
            <p className="text-xs">{line1}</p>
            <p className="text-lg font-semibold leading-tight">{line2}</p>
        </div>
    </button>
);


export const InstallView: React.FC<InstallViewProps> = ({ deferredPrompt }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    useEffect(() => {
        const generateQrCode = () => {
            const currentUrl = window.location.href;
            if (currentUrl && currentUrl.startsWith('http')) {
                QRCode.toDataURL(currentUrl, {
                    width: 256,
                    margin: 2,
                    color: { dark: '#000000', light: '#FFFFFF' }
                })
                .then(setQrCodeUrl)
                .catch(err => {
                    console.error("QR Code generation failed:", err);
                    setQrCodeUrl(null);
                });
            } else {
                // If URL is not ready, try again shortly.
                setTimeout(generateQrCode, 100);
            }
        };
        generateQrCode();
    }, []);

    const handleInstallClick = () => {
        const instructionsEl = document.getElementById('install-instructions');
        if (deferredPrompt) {
            deferredPrompt.prompt();
        } else {
            if (instructionsEl) {
                instructionsEl.scrollIntoView({ behavior: 'smooth' });
                alert('To install the app, please follow the instructions for your device shown below.');
            }
        }
    };

    return (
        <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Install the App</h2>
                <p className="text-gray-400 mt-2">Get one-tap access by adding AI Gym Coach to your home screen.</p>
            </div>
            
            <div className="p-6 bg-gray-900/50 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Direct Install</h3>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <StoreButton icon={<AppStoreIcon />} line1="Download on the" line2="App Store" onClick={handleInstallClick} />
                    <StoreButton icon={<GooglePlayIcon />} line1="GET IT ON" line2="Google Play" onClick={handleInstallClick} />
                </div>
                 <p className="text-xs text-gray-500 mt-4">Tapping a button will add this web app to your home screen or guide you through the process.</p>
            </div>

            <div id="install-instructions" className="space-y-8 pt-4">
                 <div className="text-center">
                    <h3 className="text-xl font-bold text-white">Manual Install Instructions</h3>
                    <p className="text-gray-400 mt-1">If the buttons don't work, follow these steps.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-900/50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-white mb-4">iPhone (Safari)</h3>
                        <ol className="space-y-4">
                            <InstructionStep number={1}>
                                Tap the 'Share' icon <ShareIcon /> at the bottom of the screen.
                            </InstructionStep>
                            <InstructionStep number={2}>
                                Scroll down and tap 'Add to Home Screen' <AddToHomeScreenIcon />.
                            </InstructionStep>
                            <InstructionStep number={3}>
                                Confirm by tapping 'Add'.
                            </InstructionStep>
                        </ol>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Android (Chrome)</h3>
                        <ol className="space-y-4">
                            <InstructionStep number={1}>
                                Tap the three-dot menu icon <MoreVertIcon /> in the top-right corner.
                            </InstructionStep>
                            <InstructionStep number={2}>
                                Tap on 'Install app' or 'Add to Home screen'.
                            </InstructionStep>
                             <InstructionStep number={3}>
                                Follow the on-screen prompts to confirm.
                            </InstructionStep>
                        </ol>
                    </div>
                </div>
            </div>

             <div className="text-center pt-4">
                <h3 className="text-xl font-bold text-white mb-4">Scan QR Code</h3>
                <div className="w-48 h-48 mx-auto p-4 bg-white rounded-lg shadow-lg flex items-center justify-center">
                    {!qrCodeUrl ? <Loader /> : <img src={qrCodeUrl} alt="QR code to open the app" className="w-full h-full" />}
                </div>
            </div>
        </div>
    );
};