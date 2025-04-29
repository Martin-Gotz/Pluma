import React from 'react';
import "./imageEditable.scss"

const ImageEditable = ({ imageEditable, handleImageChange, handleImageRemove, handleRandomAvatar, toolButtons = true, alt }) => {

    return (
        <div className="image-select flex justify-center">
            <div className="content-box" onClick={() => document.getElementById('file-input').click()}>
                <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    accept="image/*"
                />

                <div className="img-box">
                    <img src={imageEditable ? imageEditable : undefined} className="image-avatar" alt={alt} />

                    {toolButtons && (
                        <div>
                            <div className="cross-img" onClick={(event) => { event.preventDefault(); event.stopPropagation(); handleImageRemove().then(r => null); }}>
                                <svg width="20" height="20" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.152 5.152a1.2 1.2 0 0 1 1.696 0L12 10.303l5.152-5.151a1.2 1.2 0 1 1 1.696 1.696L13.697 12l5.151 5.152a1.2 1.2 0 0 1-1.696 1.696L12 13.697l-5.152 5.151a1.2 1.2 0 0 1-1.696-1.696L10.303 12 5.152 6.848a1.2 1.2 0 0 1 0-1.696Z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div className="random-img" onClick={(event) => { event.preventDefault(); event.stopPropagation(); handleRandomAvatar().then(r => null); }}>
                                <svg width="16" height="16" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.75 14.25 21 16.5l-2.25 2.25"></path>
                                    <path d="M18.75 5.25 21 7.5l-2.25 2.25"></path>
                                    <path d="M3 16.5h3.993a3.75 3.75 0 0 0 3.12-1.67L12 12"></path>
                                    <path d="M3 7.5h3.993a3.75 3.75 0 0 1 3.12 1.67l3.774 5.66a3.75 3.75 0 0 0 3.12 1.67H19.5"></path>
                                    <path d="M19.5 7.5h-2.493a3.75 3.75 0 0 0-3.12 1.67l-.387.58"></path>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImageEditable;
