import '../styles/css/reset.css';
import '../styles/css/font.css';
import '../styles/css/common.css';
import '../styles/css/main.css';
import { useAppEnvStore } from '../../../appmain/app.env';
import type { DtoCandidateItem } from '../dto/dto';
import defaultUserImg from '/styles/images/user-img-120.png';

interface CandidateItemPreviewComponentProps {
    candidate: DtoCandidateItem;
}

export const CandidateItemPreviewComponent: React.FC<CandidateItemPreviewComponentProps> = ({
    candidate,
}) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';
    const photo = candidate.photoPathNm
                    ? `${imgServer}/${candidate.photoPathNm}`
                    : candidate.photoFile
                        ? URL.createObjectURL(candidate.photoFile)
                        : defaultUserImg;

    return (
        <>
            <div className="candidate-list case-01">
                <div className="candidate-area">
                    <img src={photo} alt="후보자 사진" />
                    <div>
                        <span className="candidate-group">
                            {candidate.clubNm || "입력한 소속"}
                        </span>
                        <span className="candidate-name">
                            {candidate.playerNm || "입력한 이름"}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    {candidate.pledges?.map((pledge, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder={pledge || `입력한 공약 ${index + 1}`}
                                value={pledge}
                                readOnly
                            />
                        </div>
                    ))}
                </div>
                <div className="like-group">
                    <button type="button" className="btn primary large">
                        좋아요
                    </button>
                    <div className="like-number">
                        <span><em></em>0</span>
                    </div>
                </div>
            </div>
        </>
    );

}