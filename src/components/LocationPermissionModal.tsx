import React from 'react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function LocationPermissionModal({
  isOpen,
  onAllow,
  onDeny,
  onClose
}: LocationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Konum İzni Gerekli
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Size özel hava durumu bilgisi gösterebilmek için konumunuza erişim izni gerekiyor. 
            Bu bilgi sadece hava durumu verilerini almak için kullanılacak ve saklanmayacaktır.
          </p>

          {/* Benefits */}
          <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Konum izni ile:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Bulunduğunuz şehrin hava durumu
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Daha doğru sıcaklık bilgileri
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Yerel hava koşulları
              </li>
            </ul>
          </div>

          {/* Privacy note */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium text-yellow-800 dark:text-yellow-300">Gizlilik</span>
            </div>
            Konum bilginiz sadece hava durumu API'sine gönderilir ve hiçbir yerde saklanmaz.
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDeny}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              İstanbul Kullan
            </button>
            <button
              onClick={onAllow}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Konumu Paylaş
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}