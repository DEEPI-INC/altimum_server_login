import React, { useState } from 'react';
import { testConnection } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      const response = await testConnection();
      setStatus(`✅ 백엔드 연결 성공: ${response.data.message || '연결됨'}`);
    } catch (error) {
      console.error('연결 실패:', error);
      setStatus(`❌ 백엔드 연결 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">백엔드 연결 테스트</h3>
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '테스트 중...' : '연결 테스트'}
      </button>
      {status && (
        <div className="mt-2 p-2 bg-white border rounded">
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 