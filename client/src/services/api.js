const API_BASE = 'http://localhost:5000/api';

export async function analyzeHealthData(formData, token) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to analyze symptoms');
  }
  return data;
}

export async function getHealthHistory(token) {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch history');
  }
  return data.history || [];
}

export async function getHistoryDetail(id, token) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch record detail');
  }
  return data.record;
}

export async function deleteHistoryItem(id, token) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete record');
  }
  return data;
}

export async function clearAllHistory(token) {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear history');
  }
  return data;
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return await res.json();
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
}
