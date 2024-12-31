export interface Permission {
    id: string;
    name: string;
    description: string;
};
export interface CategoryUnit {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    Unit: Unit[];
}
export interface Unit {
    id: string;
    name: string;
    categoryId: string;
    category_unit: CategoryUnit;
    Jadwal: Jadwal;
    bidangId: string;
    createdAt: string;
    updatedAt: string;
    SubUnits: SubUnit[];
}
export interface Role {
    id: string;
    name: string;
    unitData: Unit
    createdAt: string;
    updatedAt: string;
    permissions: Permission[];
};

interface SubFaculty {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubUnit {
    id: string;
    name: string;
    unit_id: string;
    createdAt: string;
    updatedAt: string;
    unit: SubFaculty;
}

export interface UnitData {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserState {
    id: string;
    username: string;
    role: Role | null;
    createdAt: string;
    updatedAt: string;
    unit: Unit[] | [];
    sub_unit: SubUnit[] | null;
    unitData: UnitData[];
}

export interface AuthState {
    userInfo: UserState | null
    userToken: string | null
    loading: boolean
    success: string | null
    error: string | null
}

export interface Indicator {
    id: string;
    kpiCode: string;
    name: string;
    sifat: string;
    tahun: string;
    baseline: string;
    target: string;
    jadwal: Jadwal;
    year: string;
    bidang: Bidang;
    MaOnKpi: MatoIndicator[];
    ma: MataAnggaran[];
    primary_pic: Unit
    primary_pic_id: string
    secondary_pic: Unit
    secondary_pic_id: string
    standard: string;
    createdAt: string;
    updatedAt: string;
}


export interface VisiMisi {
    id: string
    tahun: string
    visi: string
    misi: string
    tujuan: string
    keterangan: string
    unit: Unit
    sub_unit: SubUnit
    unitData: UnitData
    createdAt: string
    updatedAt: string
}

export interface MataAnggaran {
    id: string
    maCode: string
    name: string
    indicatorId: string
    indicator: Indicator
    unitData: UnitData
    createdAt: string
    updatedAt: string
    created_by?: string
}

export interface MatoIndicator {
    id: string
    kpiId: string
    uraian: string
    output: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    MA: MataAnggaran
    KPI: Indicator
    Pembelian: Pembelian[]
    ReviewProgram: ReviewProgram
}

export interface Rekening {
    id: string
    noRek: string
    name: string
    units: Unit[]
    sub_units: SubUnit[]
    Pembelian: Pembelian[]
    createdAt: string
    updatedAt: string
    created_by?: string
}

export interface JenisRekening {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface Pembelian {
    id: string
    rekening_id: string
    ma_id: string
    uraian: string
    satuan: string
    jumlah: number
    nilaiSatuan: number
    kuantitas: string
    createdAt: string
    updatedAt: string
    rekening: Rekening
    pagu: PaguAnggaran
    ma_to_indicator: MatoIndicator
    mata_anggaran: MataAnggaran
}

export interface Bidang {
    id: string
    name: string
    code: string
    units: Unit[]
    createdAt: string
    updatedAt: string
}

export interface Jadwal {
    id: string
    name: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

export interface Review {
    id: string
    jadwal: Jadwal
    unit: Unit
    reviewUmum: string
    tanggapanAkhir: string
    createdAt: string
    updatedAt: string
}

export interface ReviewProgram {
    id: string
    prokerId: string
    proker: MatoIndicator
    temuan: string
    saran: string
    tanggapan: string
    reviewAkhir: string
    rekomendasi: string
    createdAt: string
    updatedAt: string
}

export interface PaguAnggaran {
    id : string
    tahun: string
    unit: Unit
    pagu: string
    terpakai: number
    unitId: string
    createdAt: string
    updatedAt: string
    Pembelian: Pembelian[]
}