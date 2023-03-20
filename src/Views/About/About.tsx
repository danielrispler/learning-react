import React from "react";
import './about.css';


type Props = {
    
  } 
  type MyState = {    
    
  };

class About extends React.Component<Props,MyState> {
    constructor(props:Props) {
      super(props);
    }
    
    async componentDidMount() {
    }
    
    render() {
        return(
            <div className="pageAbout">
                <div className="pageName">About Us</div>
                <div>
                    <div className="headlines">Did You Know?</div>
                    <div className="text">
                        Costco Wholesale is a multi-billion dollar global retailer with warehouse club operations in eight countries. We are the recognized leader in our field, dedicated to quality in every area of our business and respected for our outstanding business ethics. Despite our large size and explosive international expansion, we continue to provide a family atmosphere in which our employees thrive and succeed. We are proud to have been named by Washington CEO Magazine as one of the top three companies to work for in the state of Washington.
                    </div>
                    <div className="headlines">What Is Costco?</div>
                    <div className="text">
                        Costco is a membership warehouse club, dedicated to bringing our members the best possible prices on quality brand-name merchandise. With hundreds of locations worldwide, Costco provides a wide selection of merchandise, plus the convenience of specialty departments and exclusive member services, all designed to make your shopping experience a pleasurable one.
                    </div>
                    <div className="headlines">The History of Costco</div>
                    <div className="text">
                            The company's first location, opened in 1976 under the Price Club name, was in a converted airplane hangar on Morena Boulevard in San Diego. Originally serving only small businesses, the company found it could achieve far greater buying clout by also serving a selected audience of non-business members. With that change, the growth of the warehouse club industry was off and running. In 1983, the first Costco warehouse location was opened in Seattle. Costco became the first company ever to grow from zero to $3 billion in sales in less than six years. When Costco and Price Club merged in 1993, the combined company, operating under the name PriceCostco, had 206 locations generating $16 billion in annual sales.
    
                            Our operating philosophy has been simple. Keep costs down and pass the savings on to our members. Our large membership base and tremendous buying power, combined with our never-ending quest for efficiency, result in the best possible prices for our members. Since resuming the Costco name in 1997, the company has grown worldwide with total sales in recent fiscal years exceeding $64 billion. For additional information about Costco, download the Costco Story in a PDF format to learn more.
    
                            Costco has transformed the retail world. When entrepreneur Sol Price introduced a groundbreaking retail concept in San Diego, California. Price Club was the world's first membership warehouse club, a place where efficient buying and operating practices gave members access to unmatched savings.
    
                            At first, Price Club was limited exclusively to business members, who could purchase a wide range of supplies and wholesale items. Jim Sinegal, the executive vice-president of merchandising, distribution and marketing, was instrumental in fine-tuning the merchandise and marketing strategies, helping to turn Price Club into a success story that changed the face of retailing worldwide.
    
                            Seven years later, Jim Sinegal channeled his expertise into co-founding Costco Wholesale with Jeff Brotman, and together they opened the first warehouse in Seattle, Washington in 1983.
    
                            Over the next decade, both Price Club and Costco Wholesale continued to innovate and grow, and in 1993, the two mega-retailers merged, creating a gifted leadership team that soon made Costco the world's most successful warehouse club.
    
                            Today, as the company evolves, it stays true to the qualities that helped attract and retain millions of loyal members around the globe:
    
                            Commitment to quality. Costco warehouses carry about 4,000 SKUs (stock keeping units) compared to the 30,000 found at most supermarkets. By carefully choosing products based on quality, price, brand, and features, the company can offer the best value to members.
    
                            Entrepreneurial spirit. Throughout the decades, the entrepreneurial drive for excellence has continued to define Costco staff at every level. From its management team to the people on the warehouse floor, everyone is united in a common goal to exceed member expectations.
    
                            Employee focus. Costco is often noted for being much more employee-focused than other Fortune 500 companies. By offering fair wages and top-notch benefits, the company has created a workplace culture that attracts positive, high-energy, talented employees.
                    </div>
                </div>
            </div>
            
        )
    }
  }


export default About