import React from "react";
import { Link } from "react-router";

// Children
import SidebarSelectableItem from "./selectable-item";
import SidebarSearchInput from "./search-input";
import { sidebarContent } from "./content";
import search from "./search";
import Icon from "../icon";

const searchIndex = search.createSearchIndex(sidebarContent);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      matchingNodes: search.getMatching("", searchIndex)
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    this.setState({
      searchTerm: e.target.value,
      matchingNodes: search.getMatching(e.target.value, searchIndex)
    });
  }

  renderList(items) {
    return items
      .filter((item) => this.isMatchingNode(item))
      .map((item) => {
        const toc = item.children.filter((t) => this.isMatchingNode(t));
        const alwaysExpand = !!this.state.searchTerm && toc.length > 0;

        return (
          <SidebarSelectableItem
            key={item.slug}
            path={`/${item.route}/${item.slug}`}
            text={item.text}
            toc={toc}
            location={this.props.location}
            alwaysExpand={alwaysExpand}
          />
        );
      });
  }

  isMatchingNode(node) {
    return search.isInMatching(node.text || node.content, this.state.matchingNodes);
  }

  renderContent() {
    const content = sidebarContent
      .filter((heading) => heading.render !== false)
      .filter((heading) => this.isMatchingNode(heading))
      .map((heading, i) => {
        const subheadings = heading.children
          .filter((subheading) => {
            return subheading.text ? this.isMatchingNode(subheading) : true;
          })
          .map((subheading, subheadingIndex) => {
            return (
              <div
                key={subheading.text || `${i}-${subheadingIndex}`}
              >
                <p className="Sidebar-SubHeading SubHeading">
                  {subheading.text}
                </p>
                <ul className="Sidebar-List">
                  {this.renderList(subheading.children)}
                </ul>
              </div>
            );
          });

        return (
          <div key={heading.text} className="Sidebar-Grid-block">
            <p className="Sidebar-Heading">
              {heading.text}
            </p>
            {subheadings}
          </div>
        );
      });

    return (
      <div className="Sidebar-Grid">
        { this.isMatchingNode({ text: "Introduction" }) ?
          <p className="Sidebar-Heading u-noPadding">
            Introduction
          </p>
          : null
        }
        <ul className="Sidebar-List">
          { this.isMatchingNode({ text: "Getting Started" }) ?
            <li key="sidebarlink-index" className="Sidebar-List-Item">
              <Link to="/docs" activeClassName="is-active">
                Getting Started <Icon glyph="internal-link" />
              </Link>
            </li>
            : null
          }
          { this.isMatchingNode({ text: "Native" }) ?
            <li key="sidebarlink-native" className="Sidebar-List-Item">
              <Link to="/docs/native" activeClassName="is-active">
                Native <Icon glyph="internal-link" />
              </Link>
            </li>
            : null
          }
          { this.isMatchingNode({ text: "Contributing" }) ?
            <li key="sidebarlink-contributing" className="Sidebar-List-Item">
              <a href="https://github.com/FormidableLabs/victory/#contributing">
                Contributing <Icon glyph="external-link" />
              </a>
            </li>
            : null
          }
        </ul>
        {content}
      </div>
    );
  }

  render() {
    /* eslint-disable max-len */
    return (
      <div className="Page-sidebar">
        <nav className="Sidebar">
          <div className="Sidebar-Search">
            <SidebarSearchInput
              term={this.state.searchTerm}
              onChange={this.handleSearch}
            />
          </div>
          {this.renderContent()}
        </nav>
      </div>
    );
  /* eslint-enable max-len */
  }
}

Sidebar.propTypes = {
  active: React.PropTypes.string,
  location: React.PropTypes.object
};

Sidebar.defaultProps = {
  active: null
};

export default Sidebar;
