import DetailLayanan from './DetailLayanan';
import ListLayanan from './ListLayanan';

interface LayananProps {
    datas: Array<any>;
    handleNextPage: () => void;
    detail: any;
    setDetail: (detail: any) => void
    listMessages: Array<any>;
    setListMessages?: (listMessage: any) => void;
    refSection: any;
    loadingDetail: boolean;
    isOpenDetail: boolean;
}

export default function ContentLayanan({ datas, handleNextPage, detail, refSection, loadingDetail,
    listMessages, setListMessages, isOpenDetail, setDetail }: LayananProps) {

    return (
        <div className="flex gap-4">
            <ListLayanan datas={datas} handleNextPage={handleNextPage} refSection={refSection} className={`${isOpenDetail ? 'hidden' : ''}`} />
            <DetailLayanan detailLayanan={detail} setDetailLayanan={setDetail} listMessages={listMessages}
                loadingDetail={loadingDetail} setListMessages={setListMessages} isOpenDetail={isOpenDetail} />
        </div>
    )
}
