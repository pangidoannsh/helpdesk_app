import DetailLayanan from './DetailLayanan';
import ListLayanan from './ListLayanan';

interface LayananProps {
    datas: Array<any>;
    detail: any;
    listMessages: Array<any>;
    setListMessages?: (listMessage: any) => void;
    refSection: any;
    loadingDetail: boolean;
    isOpenDetail: boolean;
}

export default function ContentLayanan({ datas, detail, refSection, loadingDetail,
    listMessages, setListMessages, isOpenDetail }: LayananProps) {

    return (
        <div className="flex gap-4">
            <ListLayanan datas={datas} refSection={refSection} className={`${isOpenDetail ? 'hidden' : ''}`} />
            <DetailLayanan detailLayanan={detail} listMessages={listMessages} loadingDetail={loadingDetail}
                setListMessages={setListMessages} isOpenDetail={isOpenDetail} />
        </div>
    )
}
