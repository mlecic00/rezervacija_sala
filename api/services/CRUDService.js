class CRUDService {
  constructor() {
    this.urlExtension = "";
  }

  async get(data) {
    return await axios.get(`${this.urlExtension}/`, { params: data });
  }

  async details(identifier) {
    return await axios.get(`${this.urlExtension}/${identifier}/`);
  }

  async create(data) {
    return await axios.post(`${this.urlExtension}/`, data);
  }

  async update(identifier, data) {
    return await axios.put(`${this.urlExtension}/${identifier}/`, data);
  }

  async delete(identifier) {
    return await axios.delete(`${this.urlExtension}/${identifier}/`);
  }
}

export default CRUDService;
