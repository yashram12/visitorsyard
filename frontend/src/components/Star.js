import React from 'react'

const Star = (props) => {

    let a;
    const stars =(n)=>{
        a=[];
        if(n>=0){
            for(let i=0;i<5;i++){
                if(i<n)
                    a.push(<p key={i} style={{color:"gold"}}><i className="fa fa-star"></i></p>)
                else
                    a.push(<p key={i} style={{color:"gainsboro"}}><i className="fa fa-star"></i></p>)
            }
        }
         return a
    }
    
    return (
            <div style={{listStyleType:"none",display:"flex",flexDirection:'row',justifyContent:"flex-start",width:'100%'}}>
            {stars(props.n)}
        </div>
    )
}

export default Star
