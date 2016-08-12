import React from 'react';
import slugid from 'slugid';
import {MultiTrackContainer} from './MultiTrackContainer.jsx';

export class MultiViewContainer extends React.Component {
    constructor(props) {
        console.log('hi');
        super(props);

        let chromInfoPath =  '//s3.amazonaws.com/pkerp/data/hg19/chromInfo.txt'
        this.awsDomain = '//52.23.165.123:9872';

        let view1 = { chromInfoPath: chromInfoPath,
                      domain: [0,2500000000], 
                      width: 400,
                      height: 400,
                      viewStyle: { float: 'left',
                                   'margin': '5px'
                                 },
                      tracks: [
                         { source: this.awsDomain + '/hg19.1/Rao2014-GM12878-MboI-allreps-filtered.1kb.cool.reduced.genome.gz', 
                            type: 'top-diagonal-heatmap', 
                            height: 200
                         },
                         {
                             source: chromInfoPath, 
                             type: 'top-chromosome-axis', width: 35
                         },
                         {
                             source: this.awsDomain + '/hg19/refgene-tiles-plus', 
                             type: 'top-gene-labels', 
                             height: 25
                         },
                         {source: this.awsDomain + '/hg19/refgene-tiles-minus', 
                             type: 'top-gene-labels', height: 25},
                      ]}

        let view2 = JSON.parse(JSON.stringify(view1));
        view2['zoomLock'] = 0;

        this.state = {
            views: [view1, view2]
        }

        for (let i = 0; i < this.state.views.length; i++) {
            if (typeof this.state.views[i].zoomLock ==  'undefined')
                this.state.views[i].zoomDispatch = d3.dispatch('zoom', 'zoomend')
            else {
                let zoomLock = this.state.views[i].zoomLock;
                if (typeof this.state.views[zoomLock].zoomDispatch == 'undefined') {
                    console.log('ERROR: view requests zoom lock to another view with an undefined zoomDispatch:', zoomLock);
                }

                this.state.views[i].zoomDispatch = this.state.views[zoomLock].zoomDispatch;
            }
        }
    }

    render() {
        let divStyle = {float: 'left'};
        return (
            <div style={divStyle}>
                { this.state.views.map(function(view, i) 
                    {
                    return (<MultiTrackContainer
                        viewConfig ={view}
                        key={slugid.nice()}
                        />)
                    })
                }
            </div>
        );
    }
}