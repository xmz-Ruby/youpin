import React from 'react'

import ProductList from './child/myProdutLists'

class winnerGroups extends React.Component{
    constructor(){
        super();

        this.state = {
            
        }
    }
    render(){
        return(
            <div className="myProducts">
            
                <ProductList />
            </div>
        )
    }
}

export default winnerGroups