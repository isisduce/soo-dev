import React, { } from 'react';
// import '../styles/css/reset.css';
// import '../styles/css/font.css';
// import '../styles/css/common.css';
// import '../styles/css/main.css';
import type { DtoCandidateItem } from '../dto/dto.candidate';
import { PromisePlayerComponent } from '../common/promise.player.component';
import { PrimaryPlayerComponent } from '../common/primary.player.component';

interface PromiseMastComponentProps {
    candidate?: DtoCandidateItem;
    onCandidateChange?: (candidate: DtoCandidateItem) => void;
    onPhotoUpload?: () => void;
}

export const PromiseMastComponent: React.FC<PromiseMastComponentProps> = (props: PromiseMastComponentProps) => {

    // const { candidate, onCandidateChange, onPhotoUpload } = props;

    return (
        <div className="main-container">
            <section>
                <div className="side-contents">
                    <div className="contents-tit">
                        <h2>공약 등록</h2>
                    </div>
                    <div className="contents-input-group">
                        <PromisePlayerComponent
                            candidate={props.candidate}
                            onCandidateChange={props.onCandidateChange}
                            onPhotoUpload={props.onPhotoUpload}
                        />
                        <PrimaryPlayerComponent
                            candidate={props.candidate}
                            onCandidateChange={props.onCandidateChange}
                            onPhotoUpload={props.onPhotoUpload}
                        />
                        <div>
                            {/* <div className="input-group02">
                                <label>공개기간</label>
                                <div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            placeholder="YYYY.MM.DD HH:MM"
                                        />
                                        <button
                                            type="button"
                                            className="btn outline small"
                                            onClick={onDateSetting}
                                        >
                                            설정
                                        </button>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            placeholder="YYYY.MM.DD HH:MM"
                                        />
                                        <button
                                            type="button"
                                            className="btn outline small"
                                            onClick={onDateSetting}
                                        >
                                            설정
                                        </button>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div>
                            {/* <div className="input-group03">
                                <label>공약 입력</label>
                                <span>
                                    <p>
                                        공약 5개를 입력할 수 있습니다.<br />
                                        <em></em>아이콘을 움직여 순서를 변경할 수 있습니다.
                                    </p>
                                </span>
                                <div className="promise-input-area">
                                    {pledges.map((pledge) => (
                                        <div key={pledge.id}>
                                            <div>
                                                <textarea
                                                    maxLength={40}
                                                    placeholder="공약을 40자 이내로 입력해 주세요."
                                                    value={pledge.text}
                                                    onChange={(e) => handlePledgeChange(pledge.id, e.target.value)}
                                                />
                                                <span>
                                                    <em>{pledge.characterCount}</em>/40
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-list"
                                                onClick={() => {}}
                                                title="공약 이동"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="contents-btn-area">
                        <span>'공개'를 선택해야 화면에 노출됩니다.</span>
                        {/* <div className="btn-group">
                            <div>
                                <button
                                    type="button"
                                    className="btn outline large"
                                    onClick={() => onTempSave?.(getFormDataForSubmit())}
                                >
                                    임시저장
                                </button>
                                <button
                                    type="button"
                                    className="btn outline large"
                                    onClick={() => onPreview?.(getFormDataForSubmit())}
                                >
                                    미리보기
                                </button>
                                <button
                                    type="button"
                                    className="btn secondary large"
                                    onClick={() => onRegisterComplete?.(getFormDataForSubmit())}
                                >
                                    등록완료
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn primary large"
                                onClick={() => onPublishToMobile?.(getFormDataForSubmit())}
                            >
                                스마트폰에 공개
                            </button>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    );
};