import React from 'react'

import ProductList from './child/myProdutLists'

class myGroups extends React.Component{
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

export default myGroups