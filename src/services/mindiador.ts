import axios from 'axios';

interface IndicadorResponse {
    version: string;
    autor: string;
    codigo: string;
    nombre: string;
    unidad_medida: string;
    serie: Array<{
        fecha: string;
        valor: number;
    }>;
}

export const obtenerValorUF = async (): Promise<number | null> => {
    try {
        const response = await axios.get<IndicadorResponse>('https://mindicador.cl/api/uf');
        
        const valorHoy = response.data.serie[0].valor;
        return valorHoy;
    } catch (error) {
        console.error("Error al obtener el valor de la UF desde mindicador.cl:", error);
        return null;
    }
};