import React from 'react';

class Card extends React.Component{
    render(){
        return(
            <div className='card md-3'>  
                <div className='card-header d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        {this.props.iconeTitle && <img src={this.props.iconeTitle} alt="" width="18" height="18" className='me-2' />}
                        <h3 className='mb-0 textoDashboard'>{this.props.title}</h3>
                    </div>
                    {this.props.botaoHeader && <div>{this.props.botaoHeader}</div>}
                </div>
                <div className='card-body'>{this.props.children}</div>
            </div>
        )
    }
}

export default Card;