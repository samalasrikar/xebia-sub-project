import api from "@/shared/services/api";

const batchService = {
  getBatches: async (config) => {
    const response = await api.get("/batches", config);
    return response.data.data;
  },

  getBatchById: async (id, config) => {
    const response = await api.get(`/batches/${id}`, config);
    return response.data.data;
  },

  createBatch: async (batchData, config) => {
    const response = await api.post("/batches", batchData, config);
    return response.data.data;
  },

  updateBatch: async (id, batchData, config) => {
    const response = await api.put(`/batches/${id}`, batchData, config);
    return response.data.data;
  },

  deleteBatch: async (id, config) => {
    const response = await api.delete(`/batches/${id}`, config);
    return response.data.data;
  }
};

export default batchService;
