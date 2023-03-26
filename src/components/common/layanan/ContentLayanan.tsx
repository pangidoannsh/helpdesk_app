import DetailLayanan from './DetailLayanan';
import ListLayanan from './ListLayanan';

interface LayananProps {
    datas: Array<any>;
    detail: any;
    refSection: any;
    setDetail: any;
    loadingDetail: boolean;
}

export default function ContentLayanan({ datas, detail, setDetail, refSection, loadingDetail }: LayananProps) {
    return (
        <div className="flex gap-4">
            <ListLayanan datas={datas} refSection={refSection} />
            <DetailLayanan detailLayanan={detail} setDetailLayanan={setDetail} loadingDetail={loadingDetail} />
        </div>
    )
}
