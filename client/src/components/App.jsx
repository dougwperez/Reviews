/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DataDisplay from './DataDisplay.jsx';
import ReviewList from './ReviewList.jsx';
import Modal from './Modal.jsx';
import GlobalStyle from '../GlobalStyles.jsx';

const ModalBtn = styled.button`
display: flex;
margin-left: -20%;
margin-right: 20%;
margin-bottom: 25px;
border: 1px solid;
padding: 8px;
background-color: white;
border-radius: 7px;
cursor:pointer;
width: 145px;



&:hover {
background-color: #f7f7f7;
  }
`;

const Body = styled.div`

width:100%;
flex: row;
align-items: center;
margin-top: 80px;
justify-content: center;

  }
`;

const TopBorder = styled.div`
border-top: solid #CDCDCD 2px;
margin-left: 22%;
margin-right: 22%;
margin-top:1%;
  }
`;

const ProjectContainer = styled.div`
display: flex;
${'' /* border: 2px black dashed; */}
flex-direction: column;
align-items: center;
justify-content: center;
margin-right: 25%;
margin-left: 5%;
  }
`;

const BottomBorder = styled.div`
border-bottom: solid #CDCDCD 2px;
margin-left: 22%;
margin-right: 22%;
margin-bottom:1%;
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      view: '',
      RatingData: '',
      TotalScore: '',
      NumOfReviews: '',
      WindowWidth: window.innerWidth,
    };

    this.getReviews = this.getReviews.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getRatingsData = this.getRatingsData.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.getReviews();
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ WindowWidth: window.innerWidth });
  }

  getReviews() {
    axios.get('/reviews')
      .then((response) => {
        const listings = [];

        const targetReviews = [];
        response.data.forEach((current) => {
          if (current.Listing) {
            listings.push(current.Listing)
          }
          if (current.Listing === listings[0]){
            targetReviews.push(current);
          }
        });

        this.setState({ reviews: targetReviews });
        this.setState({ NumOfReviews: targetReviews.length });
        this.getRatingsData(targetReviews);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getRatingsData(targetReviews) {
    const RatingsArray = targetReviews.map((current) => (current.Rating));

    const AccuracyAvg = RatingsArray.reduce((total, next) =>
      total + next.Accuracy, 0) / RatingsArray.length;
    const CleanlinessAvg = RatingsArray.reduce((total, next) =>
      total + next.Cleanliness, 0) / RatingsArray.length;
    const CommunicationAvg = RatingsArray.reduce((total, next) =>
      total + next.Communication, 0) / RatingsArray.length;
    const LocationAvg = RatingsArray.reduce((total, next) =>
      total + next.Location, 0) / RatingsArray.length;
    const CheckinAvg = RatingsArray.reduce((total, next) =>
      total + next.Checkin, 0) / RatingsArray.length;
    const ValueAvg = RatingsArray.reduce((total, next) =>
      total + next.Value, 0) / RatingsArray.length;
    const Obj = {
      Accuracy: AccuracyAvg,
      Cleanliness: CleanlinessAvg,
      Communication: CommunicationAvg,
      Location: LocationAvg,
      Checkin: CheckinAvg,
      Value: ValueAvg,
    };
    Object.entries(Obj).forEach(([key, value]) => {
      Obj[key] = Number.parseFloat(value).toFixed(1);
    });
    this.setState({ RatingData: Obj });

    const Integers = Object.values(Obj).map((current) => (parseFloat(current)));
    const Sum = Integers.reduce((t, n) => t + n) / 6;
    const Score = Number.parseFloat(Sum).toFixed(2);
    this.setState({ TotalScore: Score });
  }

  closeModal() {
    this.setState({ view: 'View' });
  }

  render() {
    return (
      <Body>
      <TopBorder/>
        <ProjectContainer>
          <GlobalStyle />
          <DataDisplay
            RatingData={this.state.RatingData}
            TotalScore={this.state.TotalScore}
            NumOfReviews={this.state.NumOfReviews}
          />
          <ReviewList reviews={this.state.reviews} />
          <ModalBtn onClick={() => this.setState({ view: 'Modal' })}>
            Show all {this.state.NumOfReviews} Reviews
          </ModalBtn>
          {this.state.view === 'Modal'
            ? <Modal
              reviews={this.state.reviews}
              RatingData={this.state.RatingData}
              TotalScore={this.state.TotalScore}
              NumOfReviews={this.state.NumOfReviews}
              closeModal={this.closeModal}
              view={this.state.view}
            /> : null}
        </ProjectContainer>
        <BottomBorder />
      </Body>
    );
  }
}

export default App;
