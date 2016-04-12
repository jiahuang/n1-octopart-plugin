import {
  React,
  FocusedContactsStore,
} from 'nylas-exports';

import OctopartStore from "./octopart-store";

export default class OctopartSidebar extends React.Component {
  static displayName = 'OctopartSidebar';

  // This sidebar component listens to the FocusedContactStore,
  // which gives us access to the Contact object of the currently
  // selected person in the conversation. If you wanted to take
  // the contact and fetch your own data, you'd want to create
  // your own store, so the flow of data would be:

  // FocusedContactStore => Your Store => Your Component
  constructor(props) {
    super(props);
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    this._unsubscribe = OctopartStore.listen(this._onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  _onChange = () => {
    this.setState(this._getStateFromStores());
  }

  _getStateFromStores = () => {
    return {
      searchText: OctopartStore.searchText(),
      part: OctopartStore.part(),
      loading: OctopartStore.loading(),
      error: OctopartStore.error(),
    };
  }

  _handleChange = (event) => {
    this.setState({searchText: event.target.value});
  }

  _handleSubmit = (event) => {
    var search = this.state.searchText.trim();
    OctopartStore._getPart(search)
  }

  _renderResults() {
    if (this.state.loading) {
      return(<div>LOADING...</div>);
    } else if (this.state.part) {
      var pricing = []
      pricing.push(
        <div className="octopartSectionHeader">
          <div>MOQ</div>
          <div>Price</div>
        </div>
      )
      this.state.part.prices.forEach(function(price, index){
        pricing.push(
          <div className="octopartSection">
            <div>
              {price.qty}
            </div>
            <div>
              <a href={price.link}>{price.price}</a>
            </div>
          </div>
        )
      })

      return( <div className="octopartResults">
        <div className="octopartRes">{this.state.part.mpn}</div>
        <img className="octopartImage" src={this.state.part.image}/>
        <div className="octopartDescription">
          {this.state.part.description}
        </div>
        <div className="octopartPricing">
          {pricing}
        </div>
      </div>);
    } else {
      return(<div></div>);
    }
  }

  _renderError() {
    return(<div className="octopartError">{this.state.error}</div>)
  }

  render() {
    const content = this.state.error ? this._renderError() : this._renderResults();
    return (
      <div className="octopartDiv">
        <form className="octopartForm" onSubmit={this._handleSubmit}>
          <label className="octopartLabel">Octopart Search</label>
          <input className="octopartInput" type="text" value={this.state.searchText} onChange={this._handleChange}/>
          <input className="octopartInput octopartButton" type="submit" value="Search"/>
        </form>
        {content}
      </div>
    );
  }
}


// Providing container styles tells the app how to constrain
// the column your component is being rendered in. The min and
// max size of the column are chosen automatically based on
// these values.
OctopartSidebar.containerStyles = {
  order: 1,
  flexShrink: 0,
};
