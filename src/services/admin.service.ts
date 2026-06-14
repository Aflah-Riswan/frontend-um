import { api } from "./api.client"


export interface BackendUser {
    id : string ,
    name : string,
    email : string,
    role : 'user' | 'admin',
    isBlocked : boolean | number,
    createdAt : string
}

export const adminService = {
    async fetchAllUsers () : Promise<BackendUser[]> {
       const response = await api.get('/admin/users')
       console.log(response)
       return response.data
    },
    
    async updateUserData(id: string, updatePayload: { name: string; email: string; role: string }) {
    const response = await api.put(`/admin/users/${id}`, updatePayload);
    return response.data;
  },

  // DELETE /api/admin/users/:id
  async deleteUserAccount(id: string) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // PATCH /api/admin/users/:id/block
  async toggleBlockStatus(id: string, isBlocked: boolean) {
    const response = await api.patch(`/admin/users/${id}/block`, { isBlocked });
    return response.data;
  }
 }
