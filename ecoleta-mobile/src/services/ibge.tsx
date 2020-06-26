import axios from 'axios';

}
interface IBGEUFResponse {
    sigla: string;
}
interface IBGEUCityResponse {
    nome: string;
}

export function getUfs() {
    return axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
}

export function getCities(uf: string) {
    return axios.get<IBGEUCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
}



