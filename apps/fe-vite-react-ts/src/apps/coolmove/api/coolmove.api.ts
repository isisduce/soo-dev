import axios from 'axios';
import { ApiCode, ApiResponse, type ApiResponseDTO } from '../../../common/dto/api.response.dto';
import type { DtoCandidateMast } from '../dto/dto.candidate';

export const FileType = {
    DIRECTORY: 'directory',
    FILE: 'file'
} as const;

export const coolmoveApi = {

    createTables: async (apiServer: string): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR_INVALID_API_SERVER,
                'API server is not configured'
            );
        }
        try {
            const response = await axios.get(`${apiServer}/coolmove/api/admin/create-tables`);
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to create tables API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while creating tables'
            );
        }
    },

    dropTables: async (apiServer: string): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR_INVALID_API_SERVER,
                'API server is not configured'
            );
        }
        try {
            const response = await axios.get(`${apiServer}/coolmove/api/admin/drop-tables`);
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to drop tables API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while dropping tables'
            );
        }
    },

    /**
     * user login
     */
    login: async (apiServer: string, username: string, password: string): Promise<ApiResponseDTO<string>> => {
        if (!apiServer) {
            return ApiResponse.failure<string>(
                ApiCode.CODE.ERROR_INVALID_API_SERVER,
                'API server is not configured'
            );
        }
        try {
            const response = await axios.post(`${apiServer}/coolmove/api/login`, { username, password });
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to login API:', error);
            return ApiResponse.failure<string>(
                ApiCode.CODE.ERROR_LOGIN_FAILURE,
                error instanceof Error ? error.message : ApiCode.CODE.ERROR_LOGIN_FAILURE_MSG
            );
        }
    },

    candidateMastSelect: async (
        apiServer: string,
        token: string,
        {
            uuid,
            type,
        }: {
            uuid?: string,
            type?: string,
        }
    ): Promise<ApiResponseDTO<DtoCandidateMast[]>> => {
        if (!apiServer) {
            return ApiResponse.failure<[]>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const api = `${apiServer}/coolmove/api/candidate-mast`;
            const axiosConfig: any = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            if (type) axiosConfig.params = { type };
            const response = await axios.get(`${api}${uuid ? `/${uuid}` : ''}`, axiosConfig);
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to load candidate API:', error);
            return ApiResponse.failure<DtoCandidateMast[]>(
                ApiCode.CODE.ERROR,
                'error occurred while loading candidate'
            );
        }
    },

    candidateMastInsert: async (
        apiServer: string,
        token: string,
        {
            candidateMast,
            photo1,
            photo2,
            voters,
        }: {
            candidateMast: DtoCandidateMast,
            photo1?: File | null,
            photo2?: File | null,
            voters?: File | null,
        }
    ): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const formData = new FormData();
            formData.append('candidateMast', JSON.stringify({
                ...candidateMast,
                sysUserId: localStorage.getItem('userid'),
            }));
            if (photo1) formData.append('photo1', photo1);
            if (photo2) formData.append('photo2', photo2);
            if (voters) formData.append('voters', voters);
            const response = await axios.post(
                `${apiServer}/coolmove/api/candidate-mast`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // axios가 자동으로 boundary 포함해서 설정함
                    }
                }
            );
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to save candidate API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while saving candidates'
            );
        }
    },

    candidateMastUpdate: async (
        apiServer: string,
        token: string,
        {
            candidateMast,
            photo1,
            photo2,
            voters,
        }: {
            candidateMast: DtoCandidateMast,
            photo1?: File | null,
            photo2?: File | null,
            voters?: File | null,
        }
    ): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const formData = new FormData();
            formData.append('candidateMast', JSON.stringify({
                ...candidateMast,
                sysUserId: localStorage.getItem('userid'),
            }));
            if (photo1) formData.append('photo1', photo1);
            if (photo2) formData.append('photo2', photo2);
            if (voters) formData.append('voters', voters);
            const response = await axios.post(
                `${apiServer}/coolmove/api/candidate-mast`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // axios가 자동으로 boundary 포함해서 설정함
                    }
                }
            );
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to save candidate API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while saving candidates'
            );
        }
    },

    candidateMastUpdatePeriod: async (apiServer: string, token: string, uuid: string, period: string, begDt: string, endDt: string): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const formData = new FormData();
            formData.append('candidateMast', JSON.stringify({
                uuid,
                period,
                begDt,
                endDt,
                sysUserId: localStorage.getItem('userid'),
            }));
            const response = await axios.post(
                `${apiServer}/coolmove/api/candidate-mast/period`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // axios가 자동으로 boundary 포함해서 설정함
                    }
                }
            );
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to save candidate API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while saving candidates'
            );
        }
    },

    candidateMastUpdateStatus: async (apiServer: string, token: string, uuid: string, status: string): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const formData = new FormData();
            formData.append('candidateMast', JSON.stringify({
                uuid,
                status,
                sysUserId: localStorage.getItem('userid'),
            }));
            const response = await axios.post(
                `${apiServer}/coolmove/api/candidate-mast/status`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // axios가 자동으로 boundary 포함해서 설정함
                    }
                }
            );
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to save candidate API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while saving candidates'
            );
        }
    },

    candidateMastRemove: async (apiServer: string, token: string, uuid: string): Promise<ApiResponseDTO<null>> => {
        if (!apiServer) {
            return ApiResponse.failure<null>(ApiCode.CODE.ERROR_INVALID_API_SERVER, 'API server is not configured');
        }
        try {
            const formData = new FormData();
            formData.append('candidateMast', JSON.stringify({
                uuid,
                sysUserId: localStorage.getItem('userid'),
            }));
            const response = await axios.post(
                `${apiServer}/coolmove/api/candidate-mast/delete`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // axios가 자동으로 boundary 포함해서 설정함
                    }
                }
            );
            const data = await response.data;
            return data;
        } catch (error) {
            console.error('Failed to save candidate API:', error);
            return ApiResponse.failure<null>(
                ApiCode.CODE.ERROR,
                'error occurred while saving candidates'
            );
        }
    }

};
