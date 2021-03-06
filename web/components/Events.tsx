import './Events.scss';

import * as React from 'react';
import { connect } from 'react-redux';

const Linkify = require('react-linkify').default;

import Event from './Event';
import Panel from './Panel';
import { List, ExpandableListItem } from './List';

import { getRecommendEvents } from '../actions/events';

interface Props {
  events?: Checkpoints.Event[];
  onGetEvents?: (eventSearch) => void;
  user?: Checkpoints.User;
}

interface State {
  selectEventID?: number;
}

const EventDescription = ({ event }: { event: Checkpoints.Event }) => {
  let name: React.ReactNode = event.name;
  if (event.eventSource == 'Facebook')
    name = <a href={`http://www.facebook.com/events/${event.id}`} target="_blank">{name}</a>

  return (
    <div className="EventDescription">
      <h1>{name}</h1>
      <Linkify properties={{ target: '_blank' }}>
        <span>{event.description}</span>
      </Linkify>
    </div>
  );
};

export class Events extends React.Component<Props, State> {
  componentDidMount() {
    this.props.onGetEvents(this.getSearchQuery());
  }

  state: State = {};

  getSearchQuery = () => {
    return {
      lat: _.isEmpty(this.props.user) ? 43.4761238 : this.props.user.location.lat,
      lng: _.isEmpty(this.props.user) ? -80.5378432 : this.props.user.location.lng,
      distance: 7000,
      filter: undefined
    } as Checkpoints.EventSearch;
  };

  onClickEvent(id: number) {
    let prevSelected = this.state.selectEventID;
    if (prevSelected == id) {
      this.setState({ selectEventID: undefined });
    }
    else {
      this.setState({ selectEventID: id });
    }
  }


  render() {
    return _.isEmpty(this.props.events) ? null : (
      <div className="Events">
        <Panel className="Events-title">
          <h1>Suggested Events</h1>
        </Panel>
        <div className="Events-list">
          <List>
            {
              this.props.events.map((event) => {
                const selected = event.id == this.state.selectEventID;
                return (
                  <ExpandableListItem
                    selected={selected}
                    expanded={selected}
                    key={event.id}
                    loading={false}
                    body={<EventDescription event={event} />}
                    onClick={() => this.onClickEvent(event.id)}
                  >
                    <Event event={event} />
                  </ExpandableListItem>
                )
              })
            }
          </List>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    user: state.users.me
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetEvents: (search: Checkpoints.EventSearch) => {
      dispatch(getRecommendEvents(search));
    }
  }
};

export const EventsContainer = connect(mapStateToProps, mapDispatchToProps)(Events);
export default EventsContainer;
