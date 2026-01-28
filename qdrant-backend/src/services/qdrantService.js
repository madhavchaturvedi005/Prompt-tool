import { QdrantClient } from '@qdrant/js-client-rest';
import { CONFIG } from '../config.js';

class QdrantService {
  constructor() {
    this.client = new QdrantClient({
      url: CONFIG.qdrant.url,
      apiKey: CONFIG.qdrant.apiKey,
    });
    this.collectionName = CONFIG.qdrant.collectionName;
  }

  // Get collection information
  async getCollectionInfo() {
    try {
      return await this.client.getCollection(this.collectionName);
    } catch (error) {
      console.error('Failed to get collection info:', error);
      throw error;
    }
  }

  // Search prompts with vector similarity
  async searchPrompts({ vector, limit, offset, scoreThreshold, filter }) {
    try {
      return await this.client.search(this.collectionName, {
        vector,
        limit,
        offset,
        score_threshold: scoreThreshold,
        filter,
        with_payload: true,
        with_vector: false,
      });
    } catch (error) {
      console.error('Failed to search prompts:', error);
      throw error;
    }
  }

  // Scroll through prompts with filters
  async scrollPrompts({ filter, limit, offset }) {
    try {
      return await this.client.scroll(this.collectionName, {
        filter,
        limit,
        offset,
        with_payload: true,
        with_vector: false,
      });
    } catch (error) {
      console.error('Failed to scroll prompts:', error);
      throw error;
    }
  }

  // Retrieve specific prompts by IDs
  async retrievePrompts(ids, withVector = false) {
    try {
      return await this.client.retrieve(this.collectionName, {
        ids,
        with_payload: true,
        with_vector: withVector,
      });
    } catch (error) {
      console.error('Failed to retrieve prompts:', error);
      throw error;
    }
  }

  // Update prompt payload
  async updatePromptPayload(id, payload) {
    try {
      await this.client.setPayload(this.collectionName, {
        payload,
        points: [id],
      });
    } catch (error) {
      console.error('Failed to update prompt payload:', error);
      throw error;
    }
  }
}

export const qdrantService = new QdrantService();
