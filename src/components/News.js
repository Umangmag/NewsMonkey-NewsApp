import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


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

   constructor() {
      super();
      console.log("Hello I am constructor from News component");   
      this.state= {
           articles : [],
           loading : false,
           page:1
               

      }
   }

   async componentDidMount() {
      console.log("cdm");
      let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1d4fdd519ede49aaa667f8ac01fa126f&page=1&pageSize=${this.props.pageSize}`;
      this.setState({loading: true}); 
      let data = await fetch(url);
      let parsedData = await data.json()
      console.log(parsedData); 
      this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})

   }

    handlePrevClick= async()=> {
      console.log("Previous")
      let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1d4fdd519ede49aaa667f8ac01fa126f&page= ${this.state.page-1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});  
      let data = await fetch(url);
      let parsedData = await data.json()

      this.setState({
            page: this.state.page-1, 
            articles: parsedData.articles,
            loading: false
    })
   }

   handleNextClick=  async()=> {
      console.log("Next ");
        let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1d4fdd519ede49aaa667f8ac01fa126f&page= ${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true}); 
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData); 
        this.setState({
              page: this.state.page+1, 
              articles: parsedData.articles,
              loading: false
      })
    }
   

  render() {
    return (
      <div className= "container my-3">
        <h1 className="text-center" style= {{margin: '35px 0px'}}>  News Monkey -Top Headlines</h1>
            {this.state.loading && <Spinner/>}
           <div className="row">
           {!this.state.loading && this.state.articles.map((element)=> {
               return <div className="col-md-4" key = {element.url}> 
                <NewsItem title= {element.title} source= {element.source.name} description= {element.description} imageUrl={element.urlToImage?element.urlToImage:"https://media.licdn.com/dms/image/D5603AQG80_Ep2b2q5g/profile-displayphoto-shrink_200_200/0/1712515121864?e=2147483647&v=beta&t=v77B10dGz2B57YWzUDfsJBwBAiG_yAYHkBfzW1GUflU"} author= {element.author} date= {element.publishedAt} newsUrl= {element.url}/>
            </div>  
            })
          }
             </div>
          <div className="container d-flex justify-content-between">
              <button disabled={this.state.page<=1} type="button" onClick= {this.handlePrevClick} className="btn btn-dark">  &larr; Previous</button>
              <button disabled= {this.state.page +1 > Math.ceil(this.state.totalResults/this.props.pageSize)}type="button"  onClick={this.handleNextClick} className="btn btn-dark"> Next &rarr;</button>
          </div>
      </div>
    )
  }
}

export default News
