package net.nan21.dnet.core.api.action;

public interface IQueryContext {

	public int getResultStart();
    public void setResultStart(int resultStart);

    public int getResultSize();
    public void setResultSize(int resultSize) ;

    public String[] getOrderByCol();
    public void setOrderByCol(String[] orderByCol);

    public String[] getOrderBySense();
    public void setOrderBySense(String[] orderBySense);
    
}
