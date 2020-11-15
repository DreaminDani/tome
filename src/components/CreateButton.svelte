<style>
  .label-container {
    position: fixed;
    bottom: 48px;
    right: 105px;
    display: table;
    visibility: hidden;
  }

  .label-text {
    color: #fff;
    background: rgba(51, 51, 51, 0.7);
    display: table-cell;
    vertical-align: middle;
    padding: 10px;
    border-radius: 3px;
  }

  .label-arrow {
    display: block;
    color: #333;
    opacity: 0.7;
    margin-top: 12px;
    margin-left: -4px;
  }

  .float {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 40px;
    right: 40px;
    background-color: hsl(245, 54%, 44%);
    color: #fff;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 3px #999;
    text-decoration: none;
    font-size: 24px;
  }

  a.float + div.label-container {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s ease;
  }

  a.float:hover + div.label-container,
  a.float:focus + div.label-container {
    visibility: visible;
    opacity: 1;
  }
</style>

<a href="/edit" class="float"> <i class="ph-plus" /> </a>
<div class="label-container">
  <div class="label-text">New Artifact</div><i
    class="ph-play-fill label-arrow" />
</div>
