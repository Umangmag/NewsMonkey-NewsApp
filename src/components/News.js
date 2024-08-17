import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

  static defaultProps ={
    country: 'in',
    pageSize: 8,
    category : 'general'
  }

  static propTypes ={
    country : PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

    capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase()+ string.slice(1)
  }

   constructor(props) {
      super(props);
      console.log("Hello I am constructor from News component");   
      this.state= {
           articles : [],
           loading : true,
           page:1,
           totalResults:0
          }
          document.title= `${this.capitalizeFirstLetter(this.props.category)}- NewsMonkey`
   }

   async updateNews(){
    this.props.setProgress(10);
    const url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=741f2f4961574aebaffadba0e4e06911&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true}); 
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json()
    this.props.setProgress(70);
    console.log(parsedData); 
    this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})
    this.props.setProgress(100);

   }

   async componentDidMount() {
     this.updateNews(); 
   }
   fetchMoreData = async() => {
     this.setState({page: this.state.page+1})
     const url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=741f2f4961574aebaffadba0e4e06911&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
     let data = await fetch(url);
     let parsedData = await data.json()
     console.log(parsedData); 
     this.setState({articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults})
  
  };

   
   
  render() {
    return (
       <>
        <h1 className="text-center" style= {{margin: '35px 0px'}}> News Monkey -Top {this.capitalizeFirstLetter(this.props.category)}  Headlines</h1>
          {this.state.loading && <Spinner/>}

          <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length<this.state.totalResults}
          loader={<Spinner/>}
          >
           <div className="container">
            <div className="row">
                {this.state.articles.map((element)=> {
                    return <div className="col-md-4" key = {element.url}> 
                      <NewsItem title= {element.title} source= {element.source.name} description= {element.description} imageUrl={element.urlToImage?element.urlToImage:"https://media.licdn.com/dms/image/D5603AQG80_Ep2b2q5g/profile-displayphoto-shrink_200_200/0/1712515121864?e=2147483647&v=beta&t=v77B10dGz2B57YWzUDfsJBwBAiG_yAYHkBfzW1GUflU"} author= {element.author} date= {element.publishedAt} newsUrl= {element.url}/>
                  </div>  
                  })
                } 
              </div>
            </div>

             </InfiniteScroll>
        </>
        

    )
  }
}

export default News
