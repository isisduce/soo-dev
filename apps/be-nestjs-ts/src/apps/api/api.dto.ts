export interface ApiParamDto {
    name: string;
    type?: string;
    required?: boolean;
    defaultValue?: any;
    description?: string;
}

export interface ApiInfoDto {
    controller: string;
    method: string;
    label: string;
    path: string;
    description?: string;
    params: ApiParamDto[];
}
