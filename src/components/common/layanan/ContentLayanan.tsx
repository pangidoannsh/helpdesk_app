import DetailLayanan from './DetailLayanan';
import ListLayanan from './ListLayanan';

interface LayananProps {
    datas: Array<any>;
    detail: any;
    refSection: any;
    setDetail: any;
}

export default function ContentLayanan({ datas, detail, setDetail, refSection }: LayananProps) {
    return (
        <div className="flex gap-4">
            <ListLayanan datas={datas} refSection={refSection} />
            <DetailLayanan detailLayanan={detail} setDetailLayanan={setDetail} />
        </div>
    )
}
